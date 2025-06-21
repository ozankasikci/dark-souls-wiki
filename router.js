class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href !== '#') {
                    window.location.hash = href;
                }
            }
        });
    }

    async handleRoute() {
        const hash = window.location.hash.slice(1);
        
        if (!hash) {
            this.showHomePage();
            return;
        }

        const [type, id] = hash.split('/');
        
        if (!type) {
            this.showHomePage();
            return;
        }

        // Check if this is a category listing (no id provided)
        if (!id) {
            await this.loadCategoryListing(type);
            return;
        }

        await this.loadContent(type, id);
    }

    async loadCategoryListing(category) {
        try {
            this.showLoading();
            
            // Clear cache for this category to ensure fresh data
            if (category === 'npcs') {
                contentLoader.clearCategoryCache('npcs');
            }
            
            const items = await contentLoader.loadCategoryListing(category);
            const html = contentRenderer.renderCategoryListing(category, items);
            this.displayContent(html);
            
            const categoryTitles = {
                areas: 'Areas',
                bosses: 'Bosses',
                items: 'Items',
                npcs: 'NPCs',
                quests: 'Quests',
                lore: 'Lore',
                weapons: 'Weapons'
            };
            
            document.title = `${categoryTitles[category] || category} - Dark Souls Wiki`;
            this.updateNavigation(category);
            
            // Load thumbnails after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadCategoryThumbnails();
            }, 100);
            
            // Add category filters
            if (typeof navigationEnhancer !== 'undefined') {
                navigationEnhancer.addCategoryFilters(category);
            }
            
        } catch (error) {
            console.error('Error loading category listing:', error);
            this.showError(error.message);
        }
    }

    async loadContent(type, id) {
        try {
            this.showLoading();
            
            const content = await contentLoader.loadContent(type, id);
            
            if (content.metadata.related) {
                content.relatedContent = await contentLoader.loadRelatedContent(content.metadata);
            }
            
            const html = contentRenderer.render(content, type);
            this.displayContent(html);
            
            document.title = `${content.metadata.name} - Dark Souls Wiki`;
            
            this.updateNavigation(type);
            
            // Load images after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadContentImages(type, content.metadata);
            }, 100);
            
            // Add navigation enhancements
            if (typeof navigationEnhancer !== 'undefined') {
                // Add table of contents for long content
                // Temporarily disabled due to DOM insertion issues
                // navigationEnhancer.addTableOfContents();
                
                // Add prev/next navigation
                const items = await contentLoader.loadCategoryListing(type);
                navigationEnhancer.addPrevNextNavigation(type, id, items);
            }
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.showError(error.message);
        }
    }

    showHomePage() {
        // Hide all sections first
        const allSections = document.querySelectorAll('main > section');
        allSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show only home page sections
        const heroSection = document.querySelector('.hero');
        const categoriesSection = document.querySelector('.categories');
        const featuredSection = document.querySelector('.featured-items');
        
        if (heroSection) heroSection.style.display = 'flex';
        if (categoriesSection) categoriesSection.style.display = 'block';
        if (featuredSection) featuredSection.style.display = 'block';
        
        document.title = 'Dark Souls Wiki - Home';
        this.updateNavigation('home');
    }

    displayContent(html) {
        // Hide all sections
        const allSections = document.querySelectorAll('main > section');
        allSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show content display section
        const contentDisplay = document.getElementById('content-display');
        const contentArea = document.getElementById('content-area');
        
        if (contentDisplay) contentDisplay.style.display = 'block';
        if (contentArea) {
            contentArea.innerHTML = html;
            window.scrollTo(0, 0);
        }
    }

    showLoading() {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="loading">
                    <p>Loading content...</p>
                </div>
            `;
        }
    }

    showError(message) {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="error">
                    <h2>Error Loading Content</h2>
                    <p>${message}</p>
                    <a href="#" class="btn">Return to Home</a>
                </div>
            `;
        }
    }

    updateNavigation(activeType) {
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (
                (activeType === 'home' && href === 'index.html') ||
                (activeType !== 'home' && href && href.includes(activeType))
            ) {
                link.classList.add('active');
            }
        });
    }

    preloadContent(type, id) {
        contentLoader.loadContent(type, id).catch(() => {});
    }
}

const router = new Router();

function updateCategoryLinks() {
    const categoryLinks = document.querySelectorAll('.category-item a, .item-card a');
    
    categoryLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href && href.endsWith('.html') && href !== 'index.html') {
            const match = href.match(/^(.+?)(?:-(\d+))?\.html$/);
            if (match) {
                const [, name] = match;
                
                const typeMap = {
                    'iudex-gundyr': 'bosses',
                    'cemetery-of-ash': 'areas',
                    'firelink-shrine': 'areas',
                    'coiled-sword': 'items',
                    'zweihander': 'weapons',
                    'elite-knight-set': 'items',
                    'ring-of-favor': 'items'
                };
                
                const type = typeMap[name] || 'items';
                link.setAttribute('href', `#${type}/${name}`);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', updateCategoryLinks);