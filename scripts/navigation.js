class NavigationEnhancer {
    constructor() {
        this.breadcrumbContainer = null;
        this.init();
    }

    init() {
        this.createBreadcrumbContainer();
        this.setupEventListeners();
        this.setupMobileSubmenu();
    }

    createBreadcrumbContainer() {
        const contentDisplay = document.getElementById('content-display');
        if (!contentDisplay) return;

        // Create breadcrumb wrapper
        const breadcrumbWrapper = document.createElement('div');
        breadcrumbWrapper.className = 'breadcrumb-wrapper';
        
        // Create container for breadcrumb inside wrapper
        const container = document.createElement('div');
        container.className = 'container';
        
        this.breadcrumbContainer = document.createElement('nav');
        this.breadcrumbContainer.className = 'breadcrumb-nav';
        this.breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');
        
        // Build the structure
        container.appendChild(this.breadcrumbContainer);
        breadcrumbWrapper.appendChild(container);
        
        // Insert before the container div inside content-display
        const contentContainer = contentDisplay.querySelector('.container');
        contentDisplay.insertBefore(breadcrumbWrapper, contentContainer);
    }

    setupEventListeners() {
        window.addEventListener('hashchange', () => this.updateBreadcrumbs());
        window.addEventListener('load', () => this.updateBreadcrumbs());
    }

    updateBreadcrumbs() {
        if (!this.breadcrumbContainer) return;

        const hash = window.location.hash.slice(1);
        const breadcrumbs = this.generateBreadcrumbs(hash);
        
        this.breadcrumbContainer.innerHTML = breadcrumbs;
        this.breadcrumbContainer.style.display = hash ? 'block' : 'none';
    }

    generateBreadcrumbs(hash) {
        if (!hash) return '';

        const [category, itemId] = hash.split('/');
        const categoryTitles = {
            areas: 'Areas',
            bosses: 'Bosses',
            items: 'Items',
            npcs: 'NPCs',
            quests: 'Quests',
            lore: 'Lore',
            weapons: 'Weapons'
        };

        const breadcrumbItems = [
            { text: 'Home', href: 'index.html' },
            { text: categoryTitles[category] || category, href: `#${category}` }
        ];

        if (itemId) {
            const itemName = this.getItemName(itemId);
            breadcrumbItems.push({ text: itemName, href: null });
        }

        return `
            <ol class="breadcrumb">
                ${breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;
                    if (isLast && !item.href) {
                        return `<li class="breadcrumb-item active" aria-current="page">${item.text}</li>`;
                    }
                    return `<li class="breadcrumb-item"><a href="${item.href}">${item.text}</a></li>`;
                }).join('')}
            </ol>
        `;
    }

    getItemName(itemId) {
        const contentTitle = document.querySelector('.content-header h1');
        if (contentTitle) {
            return contentTitle.textContent;
        }
        
        return itemId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    addPrevNextNavigation(category, currentItemId, allItems) {
        const contentArticle = document.querySelector('.content-article');
        if (!contentArticle || !allItems || allItems.length <= 1) return;

        const currentIndex = allItems.findIndex(item => item.metadata.id === currentItemId);
        if (currentIndex === -1) return;

        const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
        const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

        if (!prevItem && !nextItem) return;

        const navHtml = `
            <nav class="prev-next-navigation">
                ${prevItem ? `
                    <a href="#${category}/${prevItem.metadata.id}" class="nav-prev">
                        <span class="nav-direction">Previous</span>
                        <span class="nav-title">${prevItem.metadata.name}</span>
                    </a>
                ` : '<div></div>'}
                ${nextItem ? `
                    <a href="#${category}/${nextItem.metadata.id}" class="nav-next">
                        <span class="nav-direction">Next</span>
                        <span class="nav-title">${nextItem.metadata.name}</span>
                    </a>
                ` : '<div></div>'}
            </nav>
        `;

        contentArticle.insertAdjacentHTML('afterend', navHtml);
    }

    addCategoryFilters(category) {
        const categoryHeader = document.querySelector('.category-header');
        if (!categoryHeader) return;

        const filterOptions = this.getFilterOptionsForCategory(category);
        if (!filterOptions || filterOptions.length === 0) return;

        const filterHtml = `
            <div class="category-filters">
                <div class="filter-group">
                    <label for="sort-select">Sort by:</label>
                    <select id="sort-select" class="filter-select">
                        <option value="name">Name</option>
                        <option value="recent">Recently Added</option>
                        ${category === 'bosses' ? '<option value="souls">Soul Reward</option>' : ''}
                        ${category === 'weapons' ? '<option value="damage">Damage</option>' : ''}
                    </select>
                </div>
                ${filterOptions.length > 0 ? `
                    <div class="filter-group">
                        <label for="filter-select">Filter:</label>
                        <select id="filter-select" class="filter-select">
                            <option value="">All</option>
                            ${filterOptions.map(option => 
                                `<option value="${option.value}">${option.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                ` : ''}
            </div>
        `;

        categoryHeader.insertAdjacentHTML('beforeend', filterHtml);
        this.setupFilterHandlers();
    }

    getFilterOptionsForCategory(category) {
        switch(category) {
            case 'weapons':
                return [
                    { value: 'sword', label: 'Swords' },
                    { value: 'greatsword', label: 'Greatswords' },
                    { value: 'axe', label: 'Axes' },
                    { value: 'hammer', label: 'Hammers' },
                    { value: 'spear', label: 'Spears' },
                    { value: 'bow', label: 'Bows' },
                    { value: 'catalyst', label: 'Catalysts' },
                    { value: 'shield', label: 'Shields' }
                ];
            case 'items':
                return [
                    { value: 'consumable', label: 'Consumables' },
                    { value: 'key', label: 'Key Items' },
                    { value: 'ring', label: 'Rings' },
                    { value: 'spell', label: 'Spells' },
                    { value: 'armor', label: 'Armor' }
                ];
            case 'bosses':
                return [
                    { value: 'required', label: 'Required' },
                    { value: 'optional', label: 'Optional' }
                ];
            case 'areas':
                return [
                    { value: 'main', label: 'Main Path' },
                    { value: 'optional', label: 'Optional Areas' },
                    { value: 'dlc', label: 'DLC Areas' }
                ];
            default:
                return [];
        }
    }

    setupFilterHandlers() {
        const sortSelect = document.getElementById('sort-select');
        const filterSelect = document.getElementById('filter-select');
        const itemsGrid = document.querySelector('.items-grid');

        if (!itemsGrid) return;

        const handleFiltering = () => {
            const sortValue = sortSelect ? sortSelect.value : 'name';
            const filterValue = filterSelect ? filterSelect.value : '';
            
            const items = Array.from(itemsGrid.querySelectorAll('.item-card'));
            
            let filteredItems = items;
            if (filterValue) {
                filteredItems = items.filter(item => {
                    const tags = item.querySelectorAll('.tag');
                    const subtitle = item.querySelector('.card-subtitle');
                    const description = item.querySelector('.card-description');
                    
                    const searchText = [
                        ...Array.from(tags).map(tag => tag.textContent.toLowerCase()),
                        subtitle ? subtitle.textContent.toLowerCase() : '',
                        description ? description.textContent.toLowerCase() : ''
                    ].join(' ');
                    
                    return searchText.includes(filterValue.toLowerCase());
                });
            }

            filteredItems.sort((a, b) => {
                const aTitle = a.querySelector('h3').textContent;
                const bTitle = b.querySelector('h3').textContent;
                
                switch(sortValue) {
                    case 'name':
                        return aTitle.localeCompare(bTitle);
                    case 'souls':
                        const aSouls = this.extractSoulValue(a);
                        const bSouls = this.extractSoulValue(b);
                        return bSouls - aSouls;
                    case 'damage':
                        const aDamage = this.extractDamageValue(a);
                        const bDamage = this.extractDamageValue(b);
                        return bDamage - aDamage;
                    default:
                        return 0;
                }
            });

            itemsGrid.innerHTML = '';
            filteredItems.forEach(item => itemsGrid.appendChild(item));

            const noResultsMessage = document.querySelector('.no-results');
            if (filteredItems.length === 0) {
                if (!noResultsMessage) {
                    itemsGrid.insertAdjacentHTML('afterend', 
                        '<p class="no-results">No items match your filters.</p>'
                    );
                }
            } else if (noResultsMessage) {
                noResultsMessage.remove();
            }
        };

        if (sortSelect) sortSelect.addEventListener('change', handleFiltering);
        if (filterSelect) filterSelect.addEventListener('change', handleFiltering);
    }

    extractSoulValue(itemCard) {
        const subtitle = itemCard.querySelector('.card-subtitle');
        if (!subtitle) return 0;
        
        const match = subtitle.textContent.match(/Souls:\s*(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    extractDamageValue(itemCard) {
        const description = itemCard.querySelector('.card-description');
        if (!description) return 0;
        
        const match = description.textContent.match(/Physical:\s*(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    setupMobileSubmenu() {
        const submenuParent = document.querySelector('.has-submenu');
        if (!submenuParent) return;
        
        const parentLink = submenuParent.querySelector(':scope > a');
        if (!parentLink) return;
        
        // Check if we're on mobile
        const isMobile = () => window.innerWidth <= 768;
        
        parentLink.addEventListener('click', (e) => {
            if (isMobile()) {
                e.preventDefault();
                submenuParent.classList.toggle('open');
            }
        });
        
        // Close submenu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMobile() && !submenuParent.contains(e.target)) {
                submenuParent.classList.remove('open');
            }
        });
    }

    addTableOfContents() {
        const contentBody = document.querySelector('.content-body');
        if (!contentBody) return;

        const headings = contentBody.querySelectorAll('h2, h3');
        if (headings.length < 3) return;

        const toc = document.createElement('nav');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>Contents</h3><ul></ul>';

        const tocList = toc.querySelector('ul');
        let currentH2List = null;

        headings.forEach((heading, index) => {
            const id = heading.id || `heading-${index}`;
            heading.id = id;

            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            if (heading.tagName === 'H2') {
                li.appendChild(link);
                tocList.appendChild(li);
                currentH2List = document.createElement('ul');
                li.appendChild(currentH2List);
            } else if (heading.tagName === 'H3' && currentH2List) {
                li.appendChild(link);
                currentH2List.appendChild(li);
            }
        });

        // Find the right place to insert the TOC
        // For items: insert after the item-stats-section
        // For other content: insert before content-body
        try {
            const itemStatsSection = document.querySelector('.item-stats-section');
            if (itemStatsSection && itemStatsSection.parentElement) {
                // Item page structure
                itemStatsSection.parentElement.insertBefore(toc, contentBody);
            } else {
                // Other content types - insert before content-body in its parent
                const parentElement = contentBody.parentElement;
                if (parentElement) {
                    parentElement.insertBefore(toc, contentBody);
                }
            }
        } catch (error) {
            console.warn('Could not insert table of contents:', error);
        }
    }
}

const navigationEnhancer = new NavigationEnhancer();
window.navigationEnhancer = navigationEnhancer;