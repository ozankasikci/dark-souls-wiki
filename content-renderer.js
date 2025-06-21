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
        return template.call(this, data);
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
        
        return `
            <article class="content-article area-article">
                <header class="content-header">
                    <h1>${metadata.name}</h1>
                    ${metadata.subtitle ? `<p class="content-subtitle">${metadata.subtitle}</p>` : ''}
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                ${metadata.level_range || metadata.connected_areas ? `
                <div class="boss-info-section">
                    <h3>Area Information</h3>
                    <ul class="info-list">
                        ${metadata.level_range ? `
                        <li>
                            <strong>Recommended Level</strong>
                            <span class="value">${metadata.level_range}</span>
                        </li>
                        ` : ''}
                        ${metadata.connected_areas ? `
                        <li>
                            <strong>Connected Areas</strong>
                            <span class="value">${metadata.connected_areas.join(', ')}</span>
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

    bossTemplate(data) {
        const { metadata, html } = data;
        
        // Parse weaknesses and resistances from array format
        const weaknesses = this.parseArrayField(metadata.weaknesses);
        const resistances = this.parseArrayField(metadata.resistances);
        
        return `
            <article class="content-article boss-article">
                <header class="content-header">
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
                    <h1>${metadata.name}</h1>
                    <p class="content-subtitle">${metadata.category || metadata.item_type || 'Item'}</p>
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                ${this.renderItemStats(metadata)}
                
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
                    <h1>${metadata.name}</h1>
                    <p class="content-subtitle">${metadata.weapon_type || 'Weapon'}</p>
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
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
                <header class="content-header">
                    <h1>${metadata.name}</h1>
                    ${metadata.title ? `<p class="content-subtitle">${metadata.title}</p>` : ''}
                    ${metadata.description ? `<p class="content-description">${metadata.description}</p>` : ''}
                    ${this.renderTags(metadata.tags)}
                </header>
                
                ${metadata.location || metadata.voice_actor ? `
                <div class="boss-info-section">
                    <h3>NPC Information</h3>
                    <ul class="info-list">
                        ${metadata.location ? `
                        <li>
                            <strong>Location</strong>
                            <span class="value">${metadata.location}</span>
                        </li>
                        ` : ''}
                        ${metadata.voice_actor ? `
                        <li>
                            <strong>Voice Actor</strong>
                            <span class="value">${metadata.voice_actor}</span>
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
            weapons: 'Weapons'
        };
        
        const categoryDescriptions = {
            areas: 'Explore the interconnected world of Lordran',
            bosses: 'Face the mighty foes that guard the realm',
            items: 'Discover equipment, consumables, and treasures',
            npcs: 'Meet the inhabitants of this dying world',
            quests: 'Uncover the stories and tasks of Lordran',
            lore: 'Delve into the mysteries of the Dark Souls universe',
            weapons: 'Master the tools of combat'
        };
        
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

    renderItemCard(item, category) {
        const { metadata } = item;
        
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
                subtitle = metadata.level_range ? `Level ${metadata.level_range}` : '';
                break;
            case 'npcs':
                subtitle = metadata.location || '';
                break;
            default:
                subtitle = '';
        }
        
        return `
            <a href="#${category}/${metadata.id}" class="item-card">
                <div class="item-card-header">
                    <h3>${metadata.name}</h3>
                    ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
                </div>
                ${metadata.description ? `<p class="card-description">${metadata.description}</p>` : ''}
                <div class="item-card-footer">
                    ${extraInfo}
                    ${this.renderTags(metadata.tags)}
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
}

const contentRenderer = new ContentRenderer();