class ContentLoader {
    constructor() {
        this.cache = new Map();
    }

    async loadContent(type, id) {
        const cacheKey = `${type}/${id}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`data/${type}/${id}.md`);
            
            if (!response.ok) {
                throw new Error(`Failed to load content: ${response.status}`);
            }

            const rawContent = await response.text();
            const parsed = this.parseMarkdownWithFrontmatter(rawContent);
            
            this.cache.set(cacheKey, parsed);
            return parsed;
        } catch (error) {
            console.error(`Error loading content ${type}/${id}:`, error);
            throw error;
        }
    }

    parseMarkdownWithFrontmatter(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);

        if (!match) {
            return {
                metadata: {},
                content: content,
                html: marked.parse(content)
            };
        }

        const [, frontmatter, markdownContent] = match;
        
        let metadata = {};
        try {
            metadata = jsyaml.load(frontmatter) || {};
        } catch (error) {
            console.error('Error parsing frontmatter:', error);
        }

        return {
            metadata,
            content: markdownContent,
            html: marked.parse(markdownContent)
        };
    }

    async loadMultipleContents(items) {
        const promises = items.map(item => 
            this.loadContent(item.type, item.id).catch(err => {
                console.error(`Failed to load ${item.type}/${item.id}:`, err);
                return null;
            })
        );

        const results = await Promise.all(promises);
        return results.filter(result => result !== null);
    }

    extractRelationships(metadata) {
        const relationships = {
            areas: [],
            bosses: [],
            items: [],
            npcs: [],
            quests: [],
            lore: []
        };

        if (metadata.related) {
            for (const [type, ids] of Object.entries(metadata.related)) {
                if (relationships.hasOwnProperty(type)) {
                    relationships[type] = Array.isArray(ids) ? ids : [ids];
                }
            }
        }

        return relationships;
    }

    async loadRelatedContent(metadata) {
        const relationships = this.extractRelationships(metadata);
        const relatedContent = {};

        for (const [type, ids] of Object.entries(relationships)) {
            if (ids.length > 0) {
                const items = ids.map(id => ({ type, id }));
                relatedContent[type] = await this.loadMultipleContents(items);
            }
        }

        return relatedContent;
    }

    async loadCategoryListing(category) {
        const cacheKey = `category-listing-${category}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // Special handling for equipment category with subcategories
            if (category === 'equipment') {
                return await this.loadEquipmentListing();
            }
            
            // For now, we'll try to load a manifest file for each category
            try {
                const response = await fetch(`data/${category}/manifest.json?t=${Date.now()}`);
                if (response.ok) {
                    const manifest = await response.json();
                    
                    // Handle simple array manifests (original format)
                    if (Array.isArray(manifest)) {
                        console.log(`Loading ${category} manifest with ${manifest.length} items:`, manifest);
                        
                        // Load all items from the manifest
                        const promises = manifest.map(filename => 
                            this.loadContent(category, filename.replace('.md', '')).catch(err => {
                                console.error(`Failed to load ${category}/${filename}:`, err);
                                return null;
                            })
                        );
                        
                        const results = await Promise.all(promises);
                        const validResults = results.filter(result => result !== null);
                        console.log(`Loaded ${validResults.length} valid items for ${category}`);
                        
                        this.cache.set(cacheKey, validResults);
                        return validResults;
                    }
                }
            } catch (error) {
                console.log(`No manifest found for ${category}, trying alternative approach`);
            }
            
            // Alternative: Try to load known items based on a predefined list
            // This is a fallback for categories without manifests
            const knownItems = this.getKnownItemsForCategory(category);
            if (knownItems.length > 0) {
                const promises = knownItems.map(id => 
                    this.loadContent(category, id).catch(err => {
                        console.error(`Failed to load ${category}/${id}:`, err);
                        return null;
                    })
                );
                
                const results = await Promise.all(promises);
                const validResults = results.filter(result => result !== null);
                
                this.cache.set(cacheKey, validResults);
                return validResults;
            }
            
            return [];
        } catch (error) {
            console.error(`Error loading category listing for ${category}:`, error);
            return [];
        }
    }

    async loadWeaponSubcategories() {
        const allWeapons = [];
        
        try {
            const response = await fetch(`data/equipment/weapons/manifest.json?t=${Date.now()}`);
            if (response.ok) {
                const weaponManifest = await response.json();
                
                // Process each weapon category
                for (const [categoryKey, categoryData] of Object.entries(weaponManifest.categories)) {
                    try {
                        const categoryResponse = await fetch(`data/equipment/weapons/${categoryData.manifest}?t=${Date.now()}`);
                        if (categoryResponse.ok) {
                            const weaponFiles = await categoryResponse.json();
                            
                            // Load each weapon in the category
                            const promises = weaponFiles.map(filename => 
                                this.loadContent(`equipment/weapons/${categoryKey}`, filename.replace('.md', '')).catch(err => {
                                    console.error(`Failed to load weapon ${categoryKey}/${filename}:`, err);
                                    return null;
                                })
                            );
                            
                            const results = await Promise.all(promises);
                            const validResults = results.filter(result => result !== null);
                            
                            // Add weapon category info
                            validResults.forEach(item => {
                                item.subcategory = 'weapons';
                                item.subcategoryTitle = 'Weapons';
                                item.weaponCategory = categoryKey;
                                item.weaponCategoryTitle = categoryData.name;
                            });
                            
                            allWeapons.push(...validResults);
                        }
                    } catch (err) {
                        console.error(`Failed to load weapon category ${categoryKey}:`, err);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading weapon subcategories:', error);
        }
        
        return allWeapons;
    }

    async loadEquipmentListing() {
        const cacheKey = 'category-listing-equipment';
        
        try {
            const response = await fetch(`data/equipment/manifest.json?t=${Date.now()}`);
            console.log('Equipment manifest response:', response.ok, response.status);
            if (response.ok) {
                const manifest = await response.json();
                console.log('Equipment manifest loaded:', manifest);
                const allItems = [];
                
                // Load items from each subcategory
                const subcategoryTitles = {
                    weapons: 'Weapons',
                    armor: 'Armor',
                    shields: 'Shields',
                    rings: 'Rings',
                    catalysts: 'Catalysts'
                };
                
                for (const [subcategory, data] of Object.entries(manifest)) {
                    // Handle new structure where weapons points to a manifest file
                    if (typeof data === 'string' && data.endsWith('manifest.json')) {
                        // Load weapons subcategories
                        const weaponsItems = await this.loadWeaponSubcategories();
                        allItems.push(...weaponsItems);
                    } else if (Array.isArray(data)) {
                        // Handle regular arrays (armor, shields, rings)
                        const promises = data.map(filename => 
                            this.loadContent(`equipment/${subcategory}`, filename.replace('.md', '')).catch(err => {
                                console.error(`Failed to load equipment/${subcategory}/${filename}:`, err);
                                return null;
                            })
                        );
                        
                        const results = await Promise.all(promises);
                        const validResults = results.filter(result => result !== null);
                        
                        // Add subcategory info to each item
                        validResults.forEach(item => {
                            item.subcategory = subcategory;
                            item.subcategoryTitle = subcategoryTitles[subcategory] || subcategory;
                        });
                        
                        allItems.push(...validResults);
                    }
                }
                
                this.cache.set(cacheKey, allItems);
                return allItems;
            }
        } catch (error) {
            console.error('Error loading equipment manifest:', error);
        }
        
        return [];
    }

    getKnownItemsForCategory(category) {
        // Hardcoded fallback lists for each category
        const knownItems = {
            areas: ['northern-undead-asylum', 'firelink-shrine', 'undead-burg', 'undead-parish', 'depths', 'blighttown', 'valley-of-drakes', 'darkroot-garden', 'darkroot-basin', 'new-londo-ruins', 'sens-fortress', 'anor-londo', 'dukes-archives', 'crystal-cave'],
            bosses: ['asylum-demon', 'bell-gargoyles', 'capra-demon', 'taurus-demon'],
            items: ['estus-flask', 'coiled-sword', 'ashen-estus-flask', 'fire-keeper-soul'],
            npcs: ['fire-keeper', 'hawkwood', 'ludleth', 'andre', 'solaire-of-astora', 'siegmeyer-of-catarina', 'patches', 'patches-ds1', 'oscar-of-astora'],
            quests: ['sirris-questline', 'anri-questline', 'yoel-yuria-questline'],
            lore: ['age-of-fire', 'age-of-dark', 'first-flame', 'undead-curse'],
            equipment: [] // Will be loaded from manifest
        };
        
        return knownItems[category] || [];
    }

    clearCache() {
        this.cache.clear();
    }
    
    clearCategoryCache(category) {
        const cacheKey = `category-listing-${category}`;
        this.cache.delete(cacheKey);
    }
}

const contentLoader = new ContentLoader();