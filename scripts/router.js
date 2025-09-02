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
        
        // Track page view for analytics
        if (window.Analytics) {
            const pageTitle = hash ? `${document.title} - ${hash}` : document.title;
            const pageLocation = window.location.href;
            window.Analytics.trackPageView(pageTitle, pageLocation);
        }
        
        if (!hash) {
            this.showHomePage();
            return;
        }

        const parts = hash.split('/');
        const [type, ...rest] = parts;
        
        console.log('Router: handling route', hash, 'type:', type, 'rest:', rest);
        
        if (!type) {
            this.showHomePage();
            return;
        }

        // Handle special pages
        if (type === 'recent-changes') {
            await this.showRecentChanges();
            return;
        }
        
        if (type === 'contribute') {
            await this.showContributePage();
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
        
        // Handle item subcategory listings (e.g., #items/consumables)
        if (type === 'items' && rest.length === 1) {
            await this.loadItemCategoryListing(rest[0]);
            return;
        }

        // Check if this is a category listing (no id provided)
        if (rest.length === 0) {
            // Special handling for items category to use new items system
            if (type === 'items') {
                await this.loadItemsListing();
                return;
            }
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
            
            let html = contentRenderer.renderEquipmentSubcategory('weapons', categoryTitles[weaponCategory] || weaponCategory, items);
            
            // Add collaboration section for this weapon category
            const collaborationSection = contentRenderer.renderCategoryCollaborationSection('equipment', `weapons/${weaponCategory}`);
            html = html.replace(/<\/div>\s*$/, collaborationSection + '</div>');
            
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
            
            let html = contentRenderer.renderEquipmentSubcategory('armor', categoryTitles[armorCategory] || armorCategory, items);
            
            // Add collaboration section for this armor category
            const collaborationSection = contentRenderer.renderCategoryCollaborationSection('equipment', `armor/${armorCategory}`);
            html = html.replace(/<\/div>\s*$/, collaborationSection + '</div>');
            
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
            
            let html = contentRenderer.renderEquipmentSubcategory('shields', categoryTitles[shieldCategory] || shieldCategory, items);
            
            // Add collaboration section for this shield category
            const collaborationSection = contentRenderer.renderCategoryCollaborationSection('equipment', `shields/${shieldCategory}`);
            html = html.replace(/<\/div>\s*$/, collaborationSection + '</div>');
            
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
            
            let html = contentRenderer.renderEquipmentSubcategory('rings', categoryTitles[ringCategory] || ringCategory, items);
            
            // Add collaboration section for this ring category
            const collaborationSection = contentRenderer.renderCategoryCollaborationSection('equipment', `rings/${ringCategory}`);
            html = html.replace(/<\/div>\s*$/, collaborationSection + '</div>');
            
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

    async loadItemsListing() {
        try {
            this.showLoading();
            
            // Load all items from the equipment system
            const allItems = await contentLoader.loadItemSubcategories();
            
            // Render as items subcategory listing
            const html = contentRenderer.renderEquipmentSubcategory('items', 'Items', allItems);
            this.displayContent(html);
            
            document.title = 'Items - Dark Souls Wiki';
            this.updateNavigation('items');
            
            // Load thumbnails after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadCategoryThumbnails();
            }, 100);
            
        } catch (error) {
            console.error('Error loading items listing:', error);
            this.showError(error.message);
        }
    }

    async loadItemCategoryListing(itemCategory) {
        try {
            this.showLoading();
            
            // Load all items 
            const allItems = await contentLoader.loadItemSubcategories();
            
            // Filter by item category
            const items = allItems.filter(item => 
                item.itemCategory === itemCategory
            );
            
            // Get category name from manifest
            const categoryTitles = {
                'ammunition': 'Ammunition',
                'consumables': 'Consumables',
                'embers': 'Embers',
                'key-bonfire-items': 'Key/Bonfire Items',
                'keys': 'Keys',
                'multiplayer-items': 'Multiplayer Items',
                'ore': 'Ore',
                'projectiles': 'Projectiles',
                'souls': 'Souls',
                'tools': 'Tools',
                'unequippable': 'Unequippable'
            };
            
            const html = contentRenderer.renderEquipmentSubcategory(itemCategory, categoryTitles[itemCategory], items);
            this.displayContent(html);
            
            document.title = `${categoryTitles[itemCategory] || itemCategory} - Dark Souls Wiki`;
            this.updateNavigation('items');
            
            // Load thumbnails after content is rendered
            setTimeout(async () => {
                await contentRenderer.loadCategoryThumbnails();
            }, 100);
            
        } catch (error) {
            console.error('Error loading item category:', error);
            this.showError(error.message);
        }
    }

    async loadEquipmentSubcategory(subcategory) {
        try {
            this.showLoading('Loading equipment data...');
            
            // Load all equipment items
            const allItems = await contentLoader.loadCategoryListing('equipment');
            
            // Filter by subcategory - special handling for catalysts
            let items;
            if (subcategory === 'catalysts') {
                // Combine catalysts, talismans, and flames
                items = allItems.filter(item => 
                    item.subcategory === 'catalysts' || 
                    item.subcategory === 'talismans' || 
                    item.subcategory === 'flames'
                );
            } else {
                items = allItems.filter(item => item.subcategory === subcategory);
            }
            
            // Render the filtered listing
            const subcategoryTitles = {
                weapons: 'Weapons',
                armor: 'Armor',
                shields: 'Shields',
                rings: 'Rings',
                catalysts: 'Catalysts & Talismans'
            };
            
            let html = contentRenderer.renderEquipmentSubcategory(subcategory, subcategoryTitles[subcategory], items);
            
            // Add collaboration section for this equipment subcategory
            const collaborationSection = contentRenderer.renderCategoryCollaborationSection('equipment', subcategory);
            html = html.replace(/<\/div>\s*$/, collaborationSection + '</div>');
            
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
            if (category === 'equipment') {
                this.showLoading('Loading equipment data... This may take a moment.');
            } else {
                this.showLoading();
            }
            
            // Clear cache for this category to ensure fresh data
            if (category === 'npcs') {
                contentLoader.clearCategoryCache('npcs');
            }
            
            const items = await contentLoader.loadCategoryListing(category);
            let html = contentRenderer.renderCategoryListing(category, items);
            
            // Add collaboration section for category listings
            const collaborationSection = contentRenderer.renderCategoryCollaborationSection(category);
            html = html.replace(/<\/div>\s*$/, collaborationSection + '</div>');
            
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
            
            // Handle items subcategory paths like items/consumables/estus-flask
            if (type === 'items' && id.includes('/')) {
                const parts = id.split('/');
                if (parts.length === 2) {
                    // Handle item subcategory paths like consumables/estus-flask
                    contentType = `equipment/items/${parts[0]}`;
                    contentId = parts[1];
                    renderType = 'items';
                }
            } else if (type === 'equipment' && id.includes('/')) {
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
            
            const html = contentRenderer.render(content, renderType, contentType);
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
                
                // Load Giscus comments for this page
                this.loadGiscusComments(type, id);
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

    showLoading(message = 'Loading content...') {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="loading">
                    <p>${message}</p>
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

    async showRecentChanges() {
        try {
            this.showLoading();
            
            const recentChanges = new RecentChanges();
            const html = await recentChanges.createRecentChangesPage();
            
            this.displayContent(html);
            document.title = 'Recent Changes - Dark Souls Wiki';
            this.updateNavigation('contribute');
            
            // Load the actual changes data
            setTimeout(async () => {
                const changes = await recentChanges.fetchRecentChanges();
                recentChanges.renderChanges(changes);
                recentChanges.attachFilterHandlers();
            }, 100);
            
        } catch (error) {
            console.error('Error loading recent changes:', error);
            this.showError('Failed to load recent changes');
        }
    }

    async showContributePage() {
        const html = `
            <article class="content-article">
                <header class="content-header">
                    <h1>Contribute to Dark Souls Wiki</h1>
                    <p class="content-description">
                        Help us build the most comprehensive Dark Souls resource
                    </p>
                </header>
                
                <div class="content-body">
                    <h2>Ways to Contribute</h2>
                    
                    <div class="contribute-options">
                        <div class="contribute-card">
                            <h3>Quick Edits</h3>
                            <p>Click "Improve this page" on any article to suggest edits via GitHub.</p>
                            <a href="https://github.com/ozankasikci/dark-souls-wiki" target="_blank" class="btn">
                                View on GitHub
                            </a>
                        </div>
                        
                        <div class="contribute-card">
                            <h3>Content Editor</h3>
                            <p>Use our web-based CMS to edit content with a user-friendly interface.</p>
                            <a href="/admin" target="_blank" class="btn">
                                Open Editor
                            </a>
                        </div>
                        
                        <div class="contribute-card">
                            <h3>Discussion</h3>
                            <p>Share tips and strategies in the comment section of each page.</p>
                            <a href="#bosses/asylum-demon" class="btn">
                                View Example
                            </a>
                        </div>
                    </div>
                    
                    <h2>What We Need</h2>
                    <ul class="needs-list">
                        <li>Missing boss strategies and tips</li>
                        <li>Weapon scaling and upgrade paths</li>
                        <li>NPC questline walkthroughs</li>
                        <li>Hidden item locations</li>
                        <li>Lore theories and connections</li>
                        <li>Grammar and spelling corrections</li>
                    </ul>
                    
                    <h2>Getting Started</h2>
                    <ol>
                        <li>Read our <a href="/CONTRIBUTING.md" target="_blank">contribution guidelines</a></li>
                        <li>Choose a page that needs improvement</li>
                        <li>Make your edits using one of the methods above</li>
                        <li>Submit your changes for review</li>
                    </ol>
                    
                    <h2>Recent Activity</h2>
                    <p>See what others have been working on:</p>
                    <a href="#recent-changes" class="btn">View Recent Changes</a>
                </div>
            </article>
        `;
        
        this.displayContent(html);
        document.title = 'Contribute - Dark Souls Wiki';
        this.updateNavigation('contribute');
    }

    loadGiscusComments(type, id) {
        const container = document.getElementById('giscus-container');
        if (!container) return;
        
        // Clear any existing comments
        container.innerHTML = '';
        
        // Create script element for Giscus
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', 'ozankasikci/dark-souls-wiki');
        script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // TODO: Get from https://giscus.app
        script.setAttribute('data-category', 'Wiki Comments');
        script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // TODO: Get from https://giscus.app
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'top');
        script.setAttribute('data-theme', 'dark_dimmed');
        script.setAttribute('data-lang', 'en');
        script.setAttribute('data-loading', 'lazy');
        script.crossOrigin = 'anonymous';
        script.async = true;
        
        // Use the current page path as the discussion identifier
        const discussionPath = `${type}/${id}`;
        script.setAttribute('data-term', discussionPath);
        
        container.appendChild(script);
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