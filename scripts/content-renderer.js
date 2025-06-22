class ContentRenderer {
    constructor() {
        this.templates = {
            areas: this.areaTemplate,
            bosses: this.bossTemplate,
            items: this.itemTemplate,
            weapons: this.weaponTemplate,
            npcs: this.npcTemplate,
            quests: this.questTemplate,
            lore: this.loreTemplate,
            default: this.defaultTemplate
        };
    }

    render(data, type) {
        const template = this.templates[type] || this.templates.default;
        let content = template.call(this, data);
        
        // Add image support based on type and metadata
        content = this.addContentImages(content, data, type);
        
        return content;
    }
    
    addContentImages(content, data, type) {
        const { metadata } = data;
        const itemId = metadata.id || metadata.name?.toLowerCase().replace(/\s+/g, '-');
        
        // Check if ImageDatabase is available
        if (window.ImageDatabase && itemId) {
            const imageData = window.ImageDatabase.getImageData(type, itemId);
            if (imageData) {
                // For weapons, replace the weapon icon placeholder
                if (type === 'weapons' && content.includes('weapon-icon-container')) {
                    const iconPlaceholder = `<!-- Weapon icon will be loaded here -->`;
                    const iconHtml = `<img src="${imageData.url}" alt="${imageData.alt}" title="${imageData.name}" class="weapon-icon wiki-image" loading="lazy">`;
                    content = content.replace(iconPlaceholder, iconHtml);
                }
                // For other content types, add featured image after header
                else {
                    const headerEnd = content.indexOf('</header>');
                    if (headerEnd !== -1 && !content.includes('content-featured-image')) {
                        const imageHtml = `
                        <div class="content-featured-image">
                            <img src="${imageData.url}" alt="${imageData.alt}" title="${imageData.name}" class="wiki-image" loading="lazy">
                        </div>
                    `;
                        content = content.slice(0, headerEnd + 9) + imageHtml + content.slice(headerEnd + 9);
                    }
                }
            }
        }
        
        return content;
    }

    defaultTemplate(data) {
        const { metadata, html } = data;
        
        return `
            <article class="content-article">
                <header class="content-header">
                    <h1>${metadata.name || 'Untitled'}</h1>
                    ${metadata.subtitle ? `<p class="content-subtitle">${metadata.subtitle}</p>` : ''}
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                <div class="content-body">
                    ${html}
                </div>
                ${this.renderRelatedContent(data.relatedContent)}
            </article>
        `;
    }

    areaTemplate(data) {
        const { metadata, html } = data;
        const connections = metadata.connections || metadata.connected_areas;
        
        return `
            <article class="content-article area-article">
                <header class="content-header">
                    <h1>${metadata.name}</h1>
                    ${metadata.title ? `<p class="content-subtitle">${metadata.title}</p>` : metadata.subtitle ? `<p class="content-subtitle">${metadata.subtitle}</p>` : ''}
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                ${metadata.level_range || connections || metadata.bonfires || metadata.boss || metadata.region ? `
                <div class="boss-info-section">
                    <h3>Area Information</h3>
                    <ul class="info-list">
                        ${metadata.region ? `
                        <li>
                            <strong>Region</strong>
                            <span class="value">${metadata.region}</span>
                        </li>
                        ` : ''}
                        ${metadata.bonfires ? `
                        <li>
                            <strong>Bonfires</strong>
                            <span class="value">${metadata.bonfires}</span>
                        </li>
                        ` : ''}
                        ${metadata.boss && metadata.boss !== 'none' ? `
                        <li>
                            <strong>Boss</strong>
                            <span class="value">${metadata.boss}</span>
                        </li>
                        ` : ''}
                        ${metadata.level_range ? `
                        <li>
                            <strong>Recommended Level</strong>
                            <span class="value">${metadata.level_range}</span>
                        </li>
                        ` : ''}
                        ${connections ? `
                        <li>
                            <strong>Connected Areas</strong>
                            <span class="value">${Array.isArray(connections) ? connections.join(', ') : connections}</span>
                        </li>
                        ` : ''}
                    </ul>
                </div>
                ` : ''}
                
                ${metadata.npcs && metadata.npcs.length > 0 ? `
                <div class="boss-info-section">
                    <h3>Notable NPCs</h3>
                    <ul class="simple-list">
                        ${metadata.npcs.map(npc => `<li>${npc}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${metadata.enemies && metadata.enemies.length > 0 ? `
                <div class="boss-info-section">
                    <h3>Enemies</h3>
                    <ul class="simple-list">
                        ${metadata.enemies.map(enemy => `<li>${enemy}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${metadata.notable_items && metadata.notable_items.length > 0 ? `
                <div class="boss-info-section">
                    <h3>Notable Items</h3>
                    <ul class="simple-list">
                        ${metadata.notable_items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="content-body">
                    ${html}
                </div>
                
                ${this.renderRelatedContent(data.relatedContent)}
            </article>
        `;
    }

    bossTemplate(data) {
        const { metadata, html } = data;
        
        // Parse weaknesses and resistances from array format
        const weaknesses = this.parseArrayField(metadata.weaknesses);
        const resistances = this.parseArrayField(metadata.resistances);
        
        return `
            <article class="content-article boss-article">
                <div class="boss-hero-banner" id="boss-hero-${metadata.slug || metadata.name.toLowerCase().replace(/\s+/g, '-')}">
                    <!-- Hero banner image will be loaded here -->
                </div>
                
                <header class="content-header">
                    <div class="boss-portrait" id="boss-portrait-${metadata.slug || metadata.name.toLowerCase().replace(/\s+/g, '-')}">
                        <!-- Boss portrait will be loaded here -->
                    </div>
                    <h1>${metadata.name}</h1>
                    ${metadata.title ? `<p class="content-subtitle">${metadata.title}</p>` : ''}
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                ${this.renderBossStats(metadata)}
                
                <div class="boss-info-section">
                    <h3>Boss Information</h3>
                    <ul class="info-list">
                        ${metadata.health ? `
                        <li>
                            <strong>Health</strong>
                            <span class="value stat-value health">${metadata.health}</span>
                        </li>
                        ` : ''}
                        ${metadata.souls ? `
                        <li>
                            <strong>Souls</strong>
                            <span class="value stat-value souls">${metadata.souls}</span>
                        </li>
                        ` : ''}
                        ${metadata.location ? `
                        <li>
                            <strong>Location</strong>
                            <span class="value">${metadata.location}</span>
                        </li>
                        ` : ''}
                        ${metadata.optional !== undefined ? `
                        <li>
                            <strong>Optional</strong>
                            <span class="value">${metadata.optional === 'No' || metadata.optional === false ? 'No' : 'Yes'}</span>
                        </li>
                        ` : ''}
                        ${weaknesses.length > 0 ? `
                        <li>
                            <strong>Weaknesses</strong>
                            <span class="damage-types">
                                ${weaknesses.map(w => `<span class="damage-type weakness">${w}</span>`).join('')}
                            </span>
                        </li>
                        ` : ''}
                        ${resistances.length > 0 ? `
                        <li>
                            <strong>Resistances</strong>
                            <span class="damage-types">
                                ${resistances.map(r => `<span class="damage-type resistance">${r}</span>`).join('')}
                            </span>
                        </li>
                        ` : ''}
                    </ul>
                </div>
                
                <div class="content-body">
                    ${html}
                </div>
                
                ${this.renderRelatedContent(data.relatedContent)}
            </article>
        `;
    }

    itemTemplate(data) {
        const { metadata, html } = data;
        
        return `
            <article class="content-article item-article">
                <header class="content-header">
                    <div class="item-icon-container" id="item-icon-${metadata.slug || metadata.name.toLowerCase().replace(/\s+/g, '-')}">
                        <!-- Item icon will be loaded here -->
                    </div>
                    <h1>${metadata.name}</h1>
                    <p class="content-subtitle">${metadata.category || metadata.item_type || 'Item'}</p>
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                ${this.renderItemStats(metadata)}
                
                <div class="item-full-image" id="item-full-${metadata.slug || metadata.name.toLowerCase().replace(/\s+/g, '-')}">
                    <!-- Full item image will be loaded here -->
                </div>
                
                <div class="content-body">
                    ${html}
                </div>
                
                ${this.renderRelatedContent(data.relatedContent)}
            </article>
        `;
    }

    weaponTemplate(data) {
        const { metadata, html } = data;
        
        return `
            <article class="content-article weapon-article">
                <header class="content-header">
                    <div class="weapon-icon-container" id="weapon-icon-${metadata.slug || metadata.name.toLowerCase().replace(/\s+/g, '-')}">
                        <!-- Weapon icon will be loaded here -->
                    </div>
                    <h1>${metadata.name}</h1>
                    <p class="content-subtitle">${metadata.weapon_type || 'Weapon'}</p>
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                <div class="weapon-full-render" id="weapon-full-${metadata.slug || metadata.name.toLowerCase().replace(/\s+/g, '-')}">
                    <!-- Full weapon render will be loaded here -->
                </div>
                
                <div class="item-stats-section">
                    ${metadata.damage ? `
                    <div class="item-stat">
                        <span class="item-stat-label">Damage</span>
                        <span class="item-stat-value">${metadata.damage}</span>
                    </div>
                    ` : ''}
                    ${metadata.scaling ? `
                    <div class="item-stat">
                        <span class="item-stat-label">Scaling</span>
                        <span class="item-stat-value">${metadata.scaling}</span>
                    </div>
                    ` : ''}
                    ${metadata.requirements ? `
                    <div class="item-stat">
                        <span class="item-stat-label">Requirements</span>
                        <span class="item-stat-value">${metadata.requirements}</span>
                    </div>
                    ` : ''}
                    ${metadata.weight ? `
                    <div class="item-stat">
                        <span class="item-stat-label">Weight</span>
                        <span class="item-stat-value">${metadata.weight}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="content-body">
                    ${html}
                </div>
                
                ${this.renderRelatedContent(data.relatedContent)}
            </article>
        `;
    }

    npcTemplate(data) {
        const { metadata, html } = data;
        
        return `
            <article class="content-article npc-article">
                <div class="character-portrait" id="character-portrait-${metadata.slug || metadata.name.toLowerCase().replace(/\s+/g, '-')}">
                    <!-- Character portrait will be loaded here -->
                </div>
                
                <header class="content-header">
                    <h1>${metadata.name}</h1>
                    ${metadata.title ? `<p class="content-subtitle">${metadata.title}</p>` : ''}
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                ${metadata.location || metadata.voice_actor || metadata.covenant || metadata.souls ? `
                <div class="character-info-grid">
                    ${metadata.location ? `
                    <div class="info-item">
                        <span class="info-label">Location</span>
                        <span class="info-value">${metadata.location}</span>
                    </div>
                    ` : ''}
                    ${metadata.covenant ? `
                    <div class="info-item">
                        <span class="info-label">Covenant</span>
                        <span class="info-value">${metadata.covenant}</span>
                    </div>
                    ` : ''}
                    ${metadata.voice_actor ? `
                    <div class="info-item">
                        <span class="info-label">Voice Actor</span>
                        <span class="info-value">${metadata.voice_actor}</span>
                    </div>
                    ` : ''}
                    ${metadata.souls ? `
                    <div class="info-item">
                        <span class="info-label">Souls on Death</span>
                        <span class="info-value stat-value souls">${metadata.souls}</span>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                ${metadata.drops && metadata.drops.length > 0 ? `
                <div class="drops-section">
                    <h3>Drops</h3>
                    <ul class="drops-list">
                        ${metadata.drops.map(drop => `<li>${drop}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${metadata.merchant ? `
                <div class="merchant-badge">
                    <span class="merchant-icon">🛒</span>
                    <span>Merchant</span>
                </div>
                ` : ''}
                
                <div class="content-body">
                    ${html}
                </div>
                
                ${this.renderRelatedContent(data.relatedContent)}
            </article>
        `;
    }


    questTemplate(data) {
        const { metadata, html } = data;
        
        return `
            <article class="content-article quest-article">
                <header class="content-header">
                    <h1>${metadata.name}</h1>
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                ${metadata.npcs || metadata.rewards ? `
                <div class="boss-info-section">
                    <h3>Quest Information</h3>
                    <ul class="info-list">
                        ${metadata.npcs ? `
                        <li>
                            <strong>Related NPCs</strong>
                            <span class="value">${Array.isArray(metadata.npcs) ? metadata.npcs.join(', ') : metadata.npcs}</span>
                        </li>
                        ` : ''}
                        ${metadata.rewards ? `
                        <li>
                            <strong>Rewards</strong>
                            <span class="value">${Array.isArray(metadata.rewards) ? metadata.rewards.join(', ') : metadata.rewards}</span>
                        </li>
                        ` : ''}
                    </ul>
                </div>
                ` : ''}
                
                <div class="content-body">
                    ${html}
                </div>
                
                ${this.renderRelatedContent(data.relatedContent)}
            </article>
        `;
    }

    loreTemplate(data) {
        const { metadata, html } = data;
        
        return `
            <article class="content-article lore-article">
                <header class="content-header">
                    <h1>${metadata.name}</h1>
                    ${metadata.subtitle ? `<p class="content-subtitle">${metadata.subtitle}</p>` : ''}
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                <div class="content-body">
                    ${html}
                </div>
                
                ${this.renderRelatedContent(data.relatedContent)}
            </article>
        `;
    }

    renderBossStats(metadata) {
        if (!metadata.health && !metadata.souls) return '';
        
        return `
            <div class="boss-stats-grid">
                ${metadata.health ? `
                <div class="stat-item">
                    <span class="stat-label">Health</span>
                    <span class="stat-value health">${metadata.health}</span>
                </div>
                ` : ''}
                ${metadata.souls ? `
                <div class="stat-item">
                    <span class="stat-label">Souls</span>
                    <span class="stat-value souls">${metadata.souls}</span>
                </div>
                ` : ''}
                ${metadata.location ? `
                <div class="stat-item">
                    <span class="stat-label">Location</span>
                    <span class="stat-value">${metadata.location}</span>
                </div>
                ` : ''}
            </div>
        `;
    }

    renderItemStats(metadata) {
        const stats = [];
        
        // Collect all possible stat fields
        const statFields = {
            'effect': 'Effect',
            'damage': 'Damage',
            'defense': 'Defense',
            'scaling': 'Scaling',
            'requirements': 'Requirements',
            'weight': 'Weight',
            'durability': 'Durability',
            'spell_uses': 'Uses',
            'fp_cost': 'FP Cost'
        };
        
        let hasStats = false;
        for (const [field, label] of Object.entries(statFields)) {
            if (metadata[field]) {
                hasStats = true;
                break;
            }
        }
        
        if (!hasStats) return '';
        
        return `
            <div class="item-stats-section">
                ${Object.entries(statFields).map(([field, label]) => {
                    if (!metadata[field]) return '';
                    return `
                        <div class="item-stat">
                            <span class="item-stat-label">${label}</span>
                            <span class="item-stat-value">${metadata[field]}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderTags(tags) {
        if (!tags || tags.length === 0) return '';
        
        return `
            <div class="content-tags">
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
    }

    renderRelatedContent(relatedContent) {
        if (!relatedContent || Object.keys(relatedContent).length === 0) return '';
        
        const sections = [];
        
        for (const [type, items] of Object.entries(relatedContent)) {
            if (items && items.length > 0) {
                sections.push(`
                    <section class="related-section">
                        <h3>Related ${this.formatTypeName(type)}</h3>
                        <div class="related-grid">
                            ${items.map(item => `
                                <a href="#${type}/${item.metadata.id}" class="related-item">
                                    <h4>${item.metadata.name}</h4>
                                    ${item.metadata.description ? `<p>${item.metadata.description}</p>` : ''}
                                </a>
                            `).join('')}
                        </div>
                    </section>
                `);
            }
        }
        
        if (sections.length === 0) return '';
        
        return `
            <div class="related-content">
                <h2>Related Content</h2>
                ${sections.join('')}
            </div>
        `;
    }

    renderCategoryListing(category, items) {
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
        
        const categoryDescriptions = {
            areas: 'Explore the interconnected world of Lordran',
            bosses: 'Face the mighty foes that guard the realm',
            items: 'Discover consumables, keys, and materials',
            npcs: 'Meet the inhabitants of this dying world',
            quests: 'Uncover the stories and tasks of Lordran',
            lore: 'Delve into the mysteries of the Dark Souls universe',
            equipment: 'Browse weapons, armor, shields, rings, and catalysts',
            builds: 'Explore character builds and playstyles'
        };
        
        // Special handling for equipment category
        if (category === 'equipment' && items.length > 0) {
            return this.renderEquipmentListing(items);
        }
        
        return `
            <div class="category-listing">
                <header class="category-header">
                    <h1>${categoryTitles[category] || category}</h1>
                    <p class="category-description">${categoryDescriptions[category] || ''}</p>
                </header>
                
                <div class="items-grid">
                    ${items.map(item => this.renderItemCard(item, category)).join('')}
                </div>
            </div>
        `;
    }

    renderEquipmentSubcategory(subcategory, title, items) {
        const subcategoryDescriptions = {
            weapons: 'Swords, axes, bows, and other offensive equipment',
            armor: 'Helms, chest armor, gauntlets, and leg armor',
            shields: 'Small shields, medium shields, and greatshields',
            rings: 'Magical rings that provide various effects',
            catalysts: 'Sorcery catalysts, miracle talismans, and pyromancy flames'
        };
        
        // Define all subcategories for navigation
        const allSubcategories = [
            { key: 'weapons', title: 'Weapons' },
            { key: 'armor', title: 'Armor' },
            { key: 'shields', title: 'Shields' },
            { key: 'rings', title: 'Rings' },
            { key: 'catalysts', title: 'Catalysts & Talismans' }
        ];
        
        return `
            <div class="category-listing">
                <header class="category-header">
                    <h1>${title}</h1>
                    <p class="category-description">${subcategoryDescriptions[subcategory] || ''}</p>
                    
                    <nav class="equipment-nav">
                        <a href="#equipment" class="equipment-nav-link">All Equipment</a>
                        ${allSubcategories.map(sub => 
                            `<a href="#equipment/${sub.key}" class="equipment-nav-link ${sub.key === subcategory ? 'active' : ''}">${sub.title}</a>`
                        ).join('')}
                    </nav>
                </header>
                
                <div class="items-grid">
                    ${items.map(item => this.renderItemCard(item, 'equipment')).join('')}
                </div>
            </div>
        `;
    }

    renderEquipmentListing(items) {
        // Group items by subcategory
        const grouped = items.reduce((acc, item) => {
            const subcategory = item.subcategory || 'other';
            if (!acc[subcategory]) {
                acc[subcategory] = {
                    title: item.subcategoryTitle || subcategory,
                    items: []
                };
            }
            acc[subcategory].items.push(item);
            return acc;
        }, {});
        
        // Define subcategory order
        const subcategoryOrder = ['weapons', 'armor', 'shields', 'rings', 'catalysts'];
        
        return `
            <div class="category-listing equipment-listing">
                <header class="category-header">
                    <h1>Equipment</h1>
                    <p class="category-description">Browse weapons, armor, shields, rings, and catalysts</p>
                    
                    <nav class="equipment-nav">
                        ${subcategoryOrder.map(subcategory => {
                            const group = grouped[subcategory];
                            if (!group || group.items.length === 0) return '';
                            return `<a href="#equipment/${subcategory}" class="equipment-nav-link">${group.title}</a>`;
                        }).join('')}
                    </nav>
                </header>
                
                ${subcategoryOrder.map(subcategory => {
                    const group = grouped[subcategory];
                    if (!group || group.items.length === 0) return '';
                    
                    return `
                        <div class="equipment-subcategory">
                            <h2 class="subcategory-title">
                                <a href="#equipment/${subcategory}">${group.title}</a>
                            </h2>
                            <div class="items-grid">
                                ${group.items.map(item => this.renderItemCard(item, 'equipment')).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderItemCard(item, category) {
        const { metadata } = item;
        if (!metadata || !metadata.name) {
            console.error('Item missing metadata or name:', item);
            return '';
        }
        const slug = metadata.slug || metadata.name.toLowerCase().replace(/\s+/g, '-');
        
        // Get specific info based on category
        let subtitle = '';
        let extraInfo = '';
        
        switch(category) {
            case 'bosses':
                subtitle = metadata.location || '';
                extraInfo = metadata.souls ? `<span class="card-souls">${metadata.souls} Souls</span>` : '';
                break;
            case 'weapons':
                subtitle = metadata.weapon_type || 'Weapon';
                extraInfo = metadata.damage ? `<span class="card-damage">Physical: ${metadata.damage}</span>` : '';
                break;
            case 'items':
                subtitle = metadata.category || metadata.item_type || 'Item';
                break;
            case 'areas':
                subtitle = metadata.title || (metadata.region ? `${metadata.region}` : '');
                extraInfo = metadata.boss && metadata.boss !== 'none' ? `<span class="card-boss">Boss: ${metadata.boss}</span>` : '';
                break;
            case 'npcs':
                subtitle = metadata.title || metadata.location || '';
                extraInfo = metadata.covenant ? `<span class="card-covenant">${metadata.covenant}</span>` : '';
                break;
            default:
                subtitle = '';
        }
        
        // Special card design for areas
        if (category === 'areas') {
            return `
                <div class="area-card" onclick="window.location.hash='#${category}/${metadata.id}'">
                    <div class="area-card-image" data-category="${category}" data-slug="${slug}">
                        <div class="area-card-overlay"></div>
                        <div class="area-card-badge">
                            ${metadata.bonfires ? `<span class="bonfire-count">🔥 ${metadata.bonfires}</span>` : ''}
                        </div>
                    </div>
                    <div class="area-card-content">
                        <div class="area-card-header">
                            <h3 class="area-name">${metadata.name}</h3>
                            ${subtitle ? `<p class="area-subtitle">${subtitle}</p>` : ''}
                        </div>
                        ${metadata.description ? `<p class="area-description">${metadata.description}</p>` : ''}
                        <div class="area-card-info">
                            ${metadata.boss && metadata.boss !== 'none' ? `
                                <div class="boss-info">
                                    <span class="boss-label">Boss</span>
                                    <span class="boss-name">${metadata.boss}</span>
                                </div>
                            ` : ''}
                            ${metadata.region ? `
                                <div class="region-info">
                                    <span class="region-label">Region</span>
                                    <span class="region-name">${metadata.region}</span>
                                </div>
                            ` : ''}
                        </div>
                        ${metadata.tags && metadata.tags.length > 0 ? `
                            <div class="area-tags">
                                ${metadata.tags.slice(0, 3).map(tag => `<span class="area-tag">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        // Default card design for other categories
        // Handle equipment subcategory paths
        let href = `#${category}/${metadata.id}`;
        if (category === 'equipment' && item.subcategory) {
            href = `#equipment/${item.subcategory}/${metadata.id}`;
        }
        
        // For equipment items, use the subcategory for image loading
        const imageCategory = (category === 'equipment' && item.subcategory) ? item.subcategory : category;
        
        return `
            <a href="${href}" class="item-card">
                <div class="item-thumbnail-container" data-category="${imageCategory}" data-slug="${slug}">
                    <!-- Thumbnail will be loaded here -->
                </div>
                <div class="item-card-content">
                    <div class="item-card-header">
                        <h3>${metadata.name}</h3>
                        ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
                    </div>
                    ${metadata.description ? `<p class="card-description">${metadata.description}</p>` : ''}
                    <div class="item-card-footer">
                        ${extraInfo}
                        ${this.renderTags(metadata.tags)}
                    </div>
                </div>
            </a>
        `;
    }

    formatTypeName(type) {
        const names = {
            areas: 'Areas',
            bosses: 'Bosses',
            items: 'Items',
            npcs: 'NPCs',
            quests: 'Quests',
            lore: 'Lore',
            weapons: 'Weapons'
        };
        return names[type] || type;
    }

    parseArrayField(field) {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        
        // Handle string that looks like an array: "[Fire, Dark]"
        if (typeof field === 'string' && field.startsWith('[') && field.endsWith(']')) {
            return field.slice(1, -1).split(',').map(item => item.trim());
        }
        
        return [field];
    }
    
    // Load images after content is rendered
    async loadContentImages(type, metadata) {
        const slug = metadata.slug || metadata.name.toLowerCase().replace(/\s+/g, '-');
        
        switch(type) {
            case 'bosses':
                await this.loadBossImages(slug);
                break;
            case 'weapons':
                await this.loadWeaponImages(slug);
                break;
            case 'items':
                await this.loadItemImages(slug);
                break;
            case 'areas':
                await this.loadAreaImages(slug);
                break;
            case 'characters':
                await this.loadCharacterImages(slug);
                break;
        }
    }
    
    async loadBossImages(slug) {
        // Load hero banner
        const heroBanner = document.getElementById(`boss-hero-${slug}`);
        if (heroBanner) {
            const heroSrc = await imageLoader.getImage('bosses', slug, 'hero');
            const heroImg = imageLoader.createImageElement(heroSrc, `${slug} hero banner`, 'boss-hero-image');
            heroBanner.appendChild(heroImg);
        }
        
        // Load portrait
        const portrait = document.getElementById(`boss-portrait-${slug}`);
        if (portrait) {
            const portraitSrc = await imageLoader.getImage('bosses', slug, 'portrait');
            const portraitImg = imageLoader.createImageElement(portraitSrc, `${slug} portrait`, 'boss-portrait-image');
            portrait.appendChild(portraitImg);
        }
    }
    
    async loadWeaponImages(slug) {
        // Load icon
        const iconContainer = document.getElementById(`weapon-icon-${slug}`);
        if (iconContainer) {
            const iconSrc = await imageLoader.getImage('weapons', slug, 'icon');
            const iconImg = imageLoader.createImageElement(iconSrc, `${slug} icon`, 'weapon-icon');
            iconContainer.appendChild(iconImg);
        }
        
        // Load full render
        const fullContainer = document.getElementById(`weapon-full-${slug}`);
        if (fullContainer) {
            const fullSrc = await imageLoader.getImage('weapons', slug, 'full');
            const fullImg = imageLoader.createImageElement(fullSrc, `${slug} full render`, 'weapon-full-image');
            fullContainer.appendChild(fullImg);
        }
    }
    
    async loadItemImages(slug) {
        // Load icon
        const iconContainer = document.getElementById(`item-icon-${slug}`);
        if (iconContainer) {
            const iconSrc = await imageLoader.getImage('items', slug, 'icon');
            const iconImg = imageLoader.createImageElement(iconSrc, `${slug} icon`, 'item-icon');
            iconContainer.appendChild(iconImg);
        }
        
        // Load full image
        const fullContainer = document.getElementById(`item-full-${slug}`);
        if (fullContainer) {
            const fullSrc = await imageLoader.getImage('items', slug, 'full');
            const fullImg = imageLoader.createImageElement(fullSrc, `${slug} full image`, 'item-full-image');
            fullContainer.appendChild(fullImg);
        }
    }
    
    async loadAreaImages(slug) {
        // Implementation for area images
        // This would load banner and gallery images
    }
    
    async loadCharacterImages(slug) {
        // Load character portrait
        const portrait = document.getElementById(`character-portrait-${slug}`);
        if (portrait) {
            const portraitSrc = await imageLoader.getImage('characters', slug, 'portrait');
            const portraitImg = imageLoader.createImageElement(portraitSrc, `${slug} portrait`, 'character-portrait-image');
            portrait.appendChild(portraitImg);
        }
    }
    
    // Load thumbnails for category listings
    async loadCategoryThumbnails() {
        const thumbnailContainers = document.querySelectorAll('.item-thumbnail-container');
        
        thumbnailContainers.forEach(async (container) => {
            const category = container.dataset.category;
            const slug = container.dataset.slug;
            
            if (category && slug) {
                const thumbnailSrc = await imageLoader.getImage(category, slug, 'thumbnail');
                const thumbnailImg = imageLoader.createImageElement(
                    thumbnailSrc, 
                    `${slug} thumbnail`, 
                    `${category}-thumbnail item-thumbnail`
                );
                container.appendChild(thumbnailImg);
            }
        });
    }
}

const contentRenderer = new ContentRenderer();