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

        const parts = hash.split('/');
        const [type, ...rest] = parts;
        
        if (!type) {
            this.showHomePage();
            return;
        }

        // Handle equipment subcategory listings
        if (type === 'equipment' && rest.length === 1 && ['weapons', 'armor', 'shields', 'rings', 'catalysts'].includes(rest[0])) {
            await this.loadEquipmentSubcategory(rest[0]);
            return;
        }

        // Check if this is a category listing (no id provided)
        if (rest.length === 0) {
            await this.loadCategoryListing(type);
            return;
        }

        // Join the rest back for the id (handles subcategory paths)
        const id = rest.join('/');
        await this.loadContent(type, id);
    }

    async loadEquipmentSubcategory(subcategory) {
        try {
            this.showLoading();
            
            // Load all equipment items
            const allItems = await contentLoader.loadCategoryListing('equipment');
            console.log('All equipment items:', allItems);
            console.log('Looking for subcategory:', subcategory);
            
            // Filter by subcategory
            const items = allItems.filter(item => item.subcategory === subcategory);
            console.log(`Filtered items for ${subcategory}:`, items);
            console.log(`Found ${items.length} items for ${subcategory}`);
            
            // Render the filtered listing
            const subcategoryTitles = {
                weapons: 'Weapons',
                armor: 'Armor',
                shields: 'Shields',
                rings: 'Rings',
                catalysts: 'Catalysts & Talismans'
            };
            
            const html = contentRenderer.renderEquipmentSubcategory(subcategory, subcategoryTitles[subcategory], items);
            this.displayContent(html);
            
            document.title = `${subcategoryTitles[subcategory]} - Dark Souls Wiki`;
            this.updateNavigation('equipment');
            
            // Load thumbnails after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadCategoryThumbnails();
            }, 100);
            
        } catch (error) {
            console.error('Error loading equipment subcategory:', error);
            this.showError(error.message);
        }
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
                equipment: 'Equipment',
                builds: 'Builds'
            };
            
            document.title = `${categoryTitles[category] || category} - Dark Souls Wiki`;
            this.updateNavigation(category);
            
            // Load thumbnails after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadCategoryThumbnails();
            }, 100);
            
            // Add category filters after a delay
            setTimeout(() => {
                if (typeof navigationEnhancer !== 'undefined') {
                    navigationEnhancer.addCategoryFilters(category);
                }
            }, 100);
            
        } catch (error) {
            console.error('Error loading category listing:', error);
            this.showError(error.message);
        }
    }

    async loadContent(type, id) {
        try {
            this.showLoading();
            
            // Handle equipment subcategory paths
            let contentType = type;
            let contentId = id;
            let renderType = type;
            
            if (type === 'equipment' && id.includes('/')) {
                const parts = id.split('/');
                contentType = `equipment/${parts[0]}`;
                contentId = parts[1];
                renderType = parts[0]; // Use subcategory (e.g., 'weapons') for rendering
            }
            
            const content = await contentLoader.loadContent(contentType, contentId);
            
            if (content.metadata.related) {
                content.relatedContent = await contentLoader.loadRelatedContent(content.metadata);
            }
            
            const html = contentRenderer.render(content, renderType);
            this.displayContent(html);
            
            document.title = `${content.metadata.name} - Dark Souls Wiki`;
            
            this.updateNavigation(type.split('/')[0]);
            
            // Load images after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadContentImages(contentType, content.metadata);
            }, 100);
            
            // Add navigation enhancements after a delay to ensure navigationEnhancer is loaded
            setTimeout(() => {
                if (typeof navigationEnhancer !== 'undefined') {
                    // Add table of contents for long content
                    // Temporarily disabled due to DOM insertion issues
                    // navigationEnhancer.addTableOfContents();
                    
                    // Add prev/next navigation
                    contentLoader.loadCategoryListing(type.split('/')[0]).then(items => {
                        navigationEnhancer.addPrevNextNavigation(type, id, items);
                    });
                }
            }, 100);
            
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
        
        // Show between-sections ad on homepage
        const betweenSectionsAd = document.querySelector('.ad-between-sections');
        if (betweenSectionsAd) betweenSectionsAd.style.display = 'block';
        
        document.title = 'Dark Souls Wiki - Home';
        this.updateNavigation('home');
    }

    displayContent(html) {
        // Hide all sections
        const allSections = document.querySelectorAll('main > section');
        allSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Hide between-sections ad on content pages
        const betweenSectionsAd = document.querySelector('.ad-between-sections');
        if (betweenSectionsAd) betweenSectionsAd.style.display = 'none';
        
        // Show content display section
        const contentDisplay = document.getElementById('content-display');
        const contentArea = document.getElementById('content-area');
        
        if (contentDisplay) contentDisplay.style.display = 'block';
        if (contentArea) {
            contentArea.innerHTML = html;
            
            // Only scroll to top if not switching between equipment pages
            const currentHash = window.location.hash;
            const previousHash = this.previousHash || '';
            
            // Check if we're navigating within equipment section
            const isWithinEquipment = 
                (previousHash === '#equipment' || previousHash.startsWith('#equipment/')) && 
                (currentHash === '#equipment' || currentHash.startsWith('#equipment/'));
            
            if (!isWithinEquipment) {
                window.scrollTo(0, 0);
            }
            
            this.previousHash = currentHash;
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
                    'zweihander': 'equipment',
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