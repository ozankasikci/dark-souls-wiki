// Ad Manager for Dark Souls Wiki
class AdManager {
    constructor() {
        this.adSlots = {
            'header-banner': { width: 728, height: 90, type: 'banner' },
            'between-sections': { width: 728, height: 90, type: 'banner' },
            'footer-banner': { width: 728, height: 90, type: 'banner' },
            'sidebar': { width: 300, height: 250, type: 'rectangle' }
        };
        
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // Initialize ad containers
        this.setupAdContainers();
        
        // Set up responsive behavior
        this.setupResponsive();
        
        // Load ads (placeholder for actual ad service integration)
        this.loadAds();
        
        this.initialized = true;
    }

    setupAdContainers() {
        // Add dark souls themed loading animation to ad containers
        const adContainers = document.querySelectorAll('.ad-content');
        
        adContainers.forEach(container => {
            const slot = container.getAttribute('data-ad-slot');
            if (slot && this.adSlots[slot]) {
                container.style.minWidth = this.adSlots[slot].width + 'px';
                container.style.minHeight = this.adSlots[slot].height + 'px';
                
                // Add loading animation
                this.addLoadingAnimation(container);
            }
        });
    }

    addLoadingAnimation(container) {
        const loader = document.createElement('div');
        loader.className = 'ad-loader';
        loader.innerHTML = `
            <div class="bonfire-loader">
                <div class="flame"></div>
                <div class="flame"></div>
                <div class="flame"></div>
            </div>
        `;
        
        // Replace placeholder with loader
        const placeholder = container.querySelector('.ad-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
            container.appendChild(loader);
        }
    }

    setupResponsive() {
        // Handle sidebar visibility
        const sidebar = document.querySelector('.ad-sidebar');
        if (!sidebar) return;

        const checkSidebarVisibility = () => {
            if (window.innerWidth >= 1600) {
                sidebar.style.display = 'block';
            } else {
                sidebar.style.display = 'none';
            }
        };

        window.addEventListener('resize', checkSidebarVisibility);
        checkSidebarVisibility();
    }

    loadAds() {
        // Placeholder for actual ad loading
        // In production, this would integrate with your ad service
        
        setTimeout(() => {
            // Simulate ad loading
            document.querySelectorAll('.ad-loader').forEach(loader => {
                loader.remove();
            });
            
            document.querySelectorAll('.ad-placeholder').forEach(placeholder => {
                placeholder.style.display = 'block';
                placeholder.textContent = 'Advertisement Space';
            });
        }, 1000);
    }

    // Method to refresh ads
    refresh(slotName) {
        const container = document.querySelector(`[data-ad-slot="${slotName}"]`);
        if (container) {
            this.addLoadingAnimation(container);
            // Reload the specific ad slot
            setTimeout(() => {
                const loader = container.querySelector('.ad-loader');
                if (loader) loader.remove();
                
                const placeholder = container.querySelector('.ad-placeholder');
                if (placeholder) {
                    placeholder.style.display = 'block';
                }
            }, 1000);
        }
    }

    // Method to handle ad visibility for lazy loading
    setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const slot = entry.target.getAttribute('data-ad-slot');
                    if (slot) {
                        // Load ad when it comes into view
                        console.log(`Loading ad: ${slot}`);
                        // Actual ad loading logic here
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.ad-content').forEach(ad => {
            observer.observe(ad);
        });
    }
}

// Initialize ad manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const adManager = new AdManager();
    adManager.init();
    adManager.setupLazyLoading();
    
    // Make it globally available for debugging
    window.adManager = adManager;
});