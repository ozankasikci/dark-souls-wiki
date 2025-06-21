// ===================================
// DARK SOULS WIKI - ANIMATIONS
// ===================================

// Ember particle animation with enhanced effects
function createEmberParticles() {
    const emberContainer = document.querySelector('.ember-container');
    if (!emberContainer) return;

    // Create initial embers
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createEmber(emberContainer), i * 200);
    }

    // Continue creating embers
    setInterval(() => {
        if (Math.random() > 0.6) {
            createEmber(emberContainer);
        }
    }, 800);
}

function createEmber(container) {
    const ember = document.createElement('div');
    ember.className = 'ember';
    
    // Random properties for variety
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 50;
    
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.left = `${startX}%`;
    ember.style.setProperty('--drift', `${drift}px`);
    
    // Vary animation duration and delay
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 2;
    
    ember.style.animation = `
        float-up ${duration}s ${delay}s infinite,
        ember-glow 2s ${delay}s infinite alternate
    `;
    
    container.appendChild(ember);
    
    // Remove ember after animation
    setTimeout(() => {
        ember.remove();
    }, (duration + delay) * 1000);
}

// Add CSS for new ember animation
const emberStyles = `
    @keyframes ember-glow {
        0% { opacity: 0.4; transform: scale(1); }
        100% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes float-up {
        0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
            transform: translateY(90vh) translateX(var(--drift, 0)) scale(1);
        }
        90% {
            opacity: 1;
            transform: translateY(10vh) translateX(calc(var(--drift, 0) * -1)) scale(1);
        }
        100% {
            transform: translateY(-10vh) translateX(0) scale(0);
            opacity: 0;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = emberStyles;
document.head.appendChild(styleSheet);

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.category-card, .item-card, .section-title, .content-header, .boss-info-section, .strategy-phase'
    );
    
    animatableElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero-background');
    const bonfire = document.querySelector('.hero-bonfire');
    if (!hero) return;

    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        
        if (bonfire) {
            bonfire.style.transform = `translateX(-50%) translateY(${scrolled * -0.3}px)`;
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Enhanced 3D card hover effect
function init3DCards() {
    const cards = document.querySelectorAll('.category-card, .item-card');
    
    cards.forEach(card => {
        // Add inner glow element
        const glow = document.createElement('div');
        glow.className = 'card-glow-effect';
        glow.style.pointerEvents = 'none'; // Ensure glow doesn't block clicks
        card.appendChild(glow);
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
            
            // Move glow effect
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.3), transparent 50%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            glow.style.background = 'transparent';
        });
    });
}

// Bonfire flame enhancement
function enhanceBonfire() {
    const bonfire = document.querySelector('.hero-bonfire');
    if (!bonfire) return;
    
    // Add sparks
    setInterval(() => {
        if (Math.random() > 0.8) {
            createSpark(bonfire);
        }
    }, 500);
}

function createSpark(bonfire) {
    const spark = document.createElement('div');
    spark.className = 'bonfire-spark';
    spark.style.left = `${45 + Math.random() * 10}%`;
    spark.style.animation = `spark-fly ${1 + Math.random()}s ease-out forwards`;
    
    bonfire.appendChild(spark);
    
    setTimeout(() => spark.remove(), 1500);
}

// Add spark animation styles
const sparkStyles = `
    .bonfire-spark {
        position: absolute;
        bottom: 40px;
        width: 3px;
        height: 3px;
        background: #ff8c42;
        border-radius: 50%;
        box-shadow: 0 0 6px #ff8c42;
    }
    
    @keyframes spark-fly {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-60px) translateX(${(Math.random() - 0.5) * 40}px);
            opacity: 0;
        }
    }
    
    .card-glow-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transition: opacity 0.3s;
        opacity: 0;
    }
    
    .category-card:hover .card-glow-effect,
    .item-card:hover .card-glow-effect {
        opacity: 1;
    }
    
    .animate-ready {
        opacity: 0;
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
`;

styleSheet.textContent += sparkStyles;

// Mouse trail effect for magical feel - disabled to fix click issues
function initMouseTrail() {
    // Temporarily disabled to ensure links are clickable
    return;
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
        transition: opacity 0.3s;
        opacity: 0;
    `;
    document.body.appendChild(trail);
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        trail.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        trail.style.opacity = '0';
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = `${trailX - 10}px`;
        trail.style.top = `${trailY - 10}px`;
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Navigation scroll effect
function initNavScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Hide/show nav on scroll - disabled for better usability
        // if (currentScroll > lastScroll && currentScroll > 500) {
        //     nav.style.transform = 'translateY(-100%)';
        // } else {
        //     nav.style.transform = 'translateY(0)';
        // }
        
        lastScroll = currentScroll;
    });
}

// Add nav scroll styles
const navStyles = `
    .navbar.scrolled {
        background: rgba(10, 10, 10, 0.98);
        backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
    }
    
    .navbar {
        transition: transform 0.3s ease, background 0.3s ease;
    }
`;

styleSheet.textContent += navStyles;

// Sound effect placeholder (would need actual audio files)
function initSoundEffects() {
    // Add hover sounds to buttons
    document.querySelectorAll('.btn, .btn-small').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            // Play hover sound
            // const hoverSound = new Audio('/sounds/hover.mp3');
            // hoverSound.volume = 0.3;
            // hoverSound.play();
        });
        
        btn.addEventListener('click', () => {
            // Play click sound
            // const clickSound = new Audio('/sounds/click.mp3');
            // clickSound.volume = 0.5;
            // clickSound.play();
        });
    });
}

// Page transition effect - disabled to fix navigation issues
function initPageTransitions() {
    // Temporarily disabled to ensure links work properly
    return;
    
    const transitionEl = document.createElement('div');
    transitionEl.className = 'page-transition';
    transitionEl.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    document.body.appendChild(transitionEl);
    
    // Handle link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.startsWith('#') && link.hostname === window.location.hostname) {
            e.preventDefault();
            transitionEl.style.opacity = '1';
            transitionEl.style.pointerEvents = 'all';
            setTimeout(() => {
                window.location.href = link.href;
            }, 500);
        }
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    createEmberParticles();
    initSmoothScroll();
    initScrollAnimations();
    initParallax();
    init3DCards();
    enhanceBonfire();
    initMouseTrail();
    initNavScroll();
    initSoundEffects();
    initPageTransitions();
    
    // Add loaded class after a short delay
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Performance optimization - throttle resize events
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

// Add resize stopper style
const performanceStyles = `
    .resize-animation-stopper * {
        animation-play-state: paused !important;
        transition: none !important;
    }
`;

styleSheet.textContent += performanceStyles;