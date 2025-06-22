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

        // Handle weapon subcategory listings (e.g., #equipment/weapons/daggers)
        if (type === 'equipment' && rest[0] === 'weapons' && rest.length === 2) {
            await this.loadWeaponCategoryListing(rest[1]);
            return;
        }
        
        // Handle armor subcategory listings (e.g., #equipment/armor/heavy-armor)
        if (type === 'equipment' && rest[0] === 'armor' && rest.length === 2) {
            await this.loadArmorCategoryListing(rest[1]);
            return;
        }
        
        // Handle shield subcategory listings (e.g., #equipment/shields/small-shields)
        if (type === 'equipment' && rest[0] === 'shields' && rest.length === 2) {
            await this.loadShieldCategoryListing(rest[1]);
            return;
        }
        
        // Handle ring subcategory listings (e.g., #equipment/rings/offensive-rings)
        if (type === 'equipment' && rest[0] === 'rings' && rest.length === 2) {
            await this.loadRingCategoryListing(rest[1]);
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

    async loadWeaponCategoryListing(weaponCategory) {
        try {
            this.showLoading();
            
            // Load all equipment items
            const allItems = await contentLoader.loadCategoryListing('equipment');
            
            // Filter by weapon category
            const items = allItems.filter(item => 
                item.subcategory === 'weapons' && 
                item.weaponCategory === weaponCategory
            );
            
            // Get category name from manifest
            const categoryTitles = {
                'daggers': 'Daggers',
                'straight-swords': 'Straight Swords',
                'greatswords': 'Greatswords',
                'ultra-greatswords': 'Ultra Greatswords',
                'curved-swords': 'Curved Swords',
                'katanas': 'Katanas',
                'curved-greatswords': 'Curved Greatswords',
                'piercing-swords': 'Piercing Swords',
                'axes': 'Axes',
                'great-axes': 'Great Axes',
                'hammers': 'Hammers',
                'great-hammers': 'Great Hammers',
                'fist-weapons': 'Fist Weapons',
                'spears': 'Spears',
                'halberds': 'Halberds',
                'whips': 'Whips',
                'bows': 'Bows',
                'crossbows': 'Crossbows',
                'catalysts': 'Catalysts',
                'talismans': 'Talismans',
                'flames': 'Flames'
            };
            
            const html = contentRenderer.renderCategoryListing('equipment', items);
            this.displayContent(html);
            
            document.title = `${categoryTitles[weaponCategory] || weaponCategory} - Dark Souls Wiki`;
            this.updateNavigation('equipment');
            
            // Load thumbnails after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadCategoryThumbnails();
            }, 100);
            
        } catch (error) {
            console.error('Error loading weapon category:', error);
            this.showError(error.message);
        }
    }
    
    async loadArmorCategoryListing(armorCategory) {
        try {
            this.showLoading();
            
            // Load all equipment items
            const allItems = await contentLoader.loadCategoryListing('equipment');
            
            // Filter by armor category
            const items = allItems.filter(item => 
                item.subcategory === 'armor' && 
                item.armorCategory === armorCategory
            );
            
            // Get category name from manifest
            const categoryTitles = {
                'light-armor': 'Light Armor',
                'medium-armor': 'Medium Armor',
                'heavy-armor': 'Heavy Armor',
                'starting-sets': 'Starting Sets',
                'unique-armor': 'Unique Armor'
            };
            
            const html = contentRenderer.renderCategoryListing('equipment', items);
            this.displayContent(html);
            
            document.title = `${categoryTitles[armorCategory] || armorCategory} - Dark Souls Wiki`;
            this.updateNavigation('equipment');
            
            // Load thumbnails after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadCategoryThumbnails();
            }, 100);
            
        } catch (error) {
            console.error('Error loading armor category:', error);
            this.showError(error.message);
        }
    }
    
    async loadShieldCategoryListing(shieldCategory) {
        try {
            this.showLoading();
            
            // Load all equipment items
            const allItems = await contentLoader.loadCategoryListing('equipment');
            
            // Filter by shield category
            const items = allItems.filter(item => 
                item.subcategory === 'shields' && 
                item.shieldCategory === shieldCategory
            );
            
            // Get category name from manifest
            const categoryTitles = {
                'small-shields': 'Small Shields',
                'medium-shields': 'Medium Shields',
                'greatshields': 'Greatshields',
                'unique-shields': 'Unique Shields'
            };
            
            const html = contentRenderer.renderCategoryListing('equipment', items);
            this.displayContent(html);
            
            document.title = `${categoryTitles[shieldCategory] || shieldCategory} - Dark Souls Wiki`;
            this.updateNavigation('equipment');
            
            // Load thumbnails after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadCategoryThumbnails();
            }, 100);
            
        } catch (error) {
            console.error('Error loading shield category:', error);
            this.showError(error.message);
        }
    }
    
    async loadRingCategoryListing(ringCategory) {
        try {
            this.showLoading();
            
            // Load all equipment items
            const allItems = await contentLoader.loadCategoryListing('equipment');
            
            // Filter by ring category
            const items = allItems.filter(item => 
                item.subcategory === 'rings' && 
                item.ringCategory === ringCategory
            );
            
            // Get category name from manifest
            const categoryTitles = {
                'offensive-rings': 'Offensive Rings',
                'defensive-rings': 'Defensive Rings',
                'utility-rings': 'Utility Rings',
                'resistance-rings': 'Resistance Rings'
            };
            
            const html = contentRenderer.renderCategoryListing('equipment', items);
            this.displayContent(html);
            
            document.title = `${categoryTitles[ringCategory] || ringCategory} - Dark Souls Wiki`;
            this.updateNavigation('equipment');
            
            // Load thumbnails after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadCategoryThumbnails();
            }, 100);
            
        } catch (error) {
            console.error('Error loading ring category:', error);
            this.showError(error.message);
        }
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
                if (parts[0] === 'weapons' && parts.length === 3) {
                    // Handle weapon subcategory paths like weapons/hammers/club
                    contentType = `equipment/weapons/${parts[1]}`;
                    contentId = parts[2];
                    renderType = 'weapons';
                } else if (parts[0] === 'armor' && parts.length === 3) {
                    // Handle armor subcategory paths like armor/heavy-armor/havel-set
                    contentType = `equipment/armor/${parts[1]}`;
                    contentId = parts[2];
                    renderType = 'armor';
                } else if (parts[0] === 'shields' && parts.length === 3) {
                    // Handle shield subcategory paths like shields/small-shields/buckler
                    contentType = `equipment/shields/${parts[1]}`;
                    contentId = parts[2];
                    renderType = 'shields';
                } else if (parts[0] === 'rings' && parts.length === 3) {
                    // Handle ring subcategory paths like rings/offensive-rings/hornet-ring
                    contentType = `equipment/rings/${parts[1]}`;
                    contentId = parts[2];
                    renderType = 'rings';
                } else {
                    // Handle regular equipment paths
                    contentType = `equipment/${parts[0]}`;
                    contentId = parts[1];
                    renderType = parts[0];
                }
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
                await contentRenderer.loadContentImages(renderType, content.metadata);
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