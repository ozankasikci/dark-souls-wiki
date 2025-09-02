class ContentLoader {
    constructor() {
        this.cache = new Map();
    }

    async batchPromises(promises, batchSize = 20) {
        const results = [];
        console.log(`🔄 Starting batch processing: ${promises.length} items in batches of ${batchSize}`);
        
        for (let i = 0; i < promises.length; i += batchSize) {
            const batchStart = performance.now();
            const batch = promises.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch);
            results.push(...batchResults);
            console.log(`  📊 Batch ${Math.floor(i/batchSize) + 1} (${batch.length} items) took:`, performance.now() - batchStart, 'ms');
            
            // Small delay between batches to avoid overwhelming server
            if (i + batchSize < promises.length) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        return results;
    }

    async loadMetadataOnly(contentType, id) {
        const cacheKey = `meta-${contentType}/${id}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const filePath = `data/${contentType}/${id}.md`;
            const response = await fetch(`${filePath}?t=${Date.now()}`);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status}`);
            }
            
            const text = await response.text();
            
            // Extract only frontmatter, not the full content
            const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---/);
            if (!frontmatterMatch) {
                throw new Error(`No frontmatter found in ${filePath}`);
            }
            
            const metadata = jsyaml.load(frontmatterMatch[1]);
            
            // Create minimal content object with just metadata
            const content = {
                metadata: metadata,
                html: '' // Empty for performance
            };
            
            this.cache.set(cacheKey, content);
            return content;
            
        } catch (error) {
            console.error(`Error loading metadata for ${contentType}/${id}:`, error);
            throw error;
        }
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
            // Pre-process frontmatter to quote single dash values
            const processedFrontmatter = frontmatter.replace(/^(\s*\w+:\s*)-\s*$/gm, '$1"-"');
            
            metadata = jsyaml.load(processedFrontmatter) || {};
        } catch (error) {
            console.error('Error parsing frontmatter:', error.message || error);
            console.error('Full error:', error);
            console.error('Problematic frontmatter:', frontmatter.substring(0, 200) + '...');
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
                        const promises = manifest.map(filename => {
                            const itemId = filename.replace('.md', '');
                            return this.loadContent(category, itemId).then(loadedItem => {
                                // Ensure the item has an ID in its metadata
                                if (!loadedItem.metadata.id) {
                                    loadedItem.metadata.id = itemId;
                                }
                                return loadedItem;
                            }).catch(err => {
                                console.error(`Failed to load ${category}/${filename}:`, err);
                                return null;
                            });
                        });
                        
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
                    this.loadMetadataOnly(category, id).catch(err => {
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
                        const categoryStart = performance.now();
                        console.log(`  🗡️ Loading weapon category: ${categoryKey}...`);
                        const categoryResponse = await fetch(`data/equipment/weapons/${categoryKey}/manifest.json?t=${Date.now()}`);
                        if (categoryResponse.ok) {
                            const categoryManifest = await categoryResponse.json();
                            
                            // Handle both array format and object format with 'items' property
                            let weaponFiles = Array.isArray(categoryManifest) ? categoryManifest : 
                                           (categoryManifest.items || []);
                            
                            // Ensure weaponFiles is an array
                            if (!Array.isArray(weaponFiles)) {
                                console.error(`Invalid manifest format for ${categoryKey}:`, categoryManifest);
                                weaponFiles = [];
                            }
                            
                            // Load only metadata for each weapon (for performance)
                            const promises = weaponFiles.map(filename => 
                                this.loadMetadataOnly(`equipment/weapons/${categoryKey}`, filename.replace('.md', '')).catch(err => {
                                    console.error(`Failed to load weapon ${categoryKey}/${filename}:`, err);
                                    return null;
                                })
                            );
                            
                            // Batch requests to avoid overwhelming server
                            const batchStart = performance.now();
                            const results = await this.batchPromises(promises, 20);
                            console.log(`    📊 Batch loading ${categoryKey} took:`, performance.now() - batchStart, 'ms');
                            const validResults = results.filter(result => result !== null);
                            
                            // Add weapon category info
                            validResults.forEach(item => {
                                item.subcategory = 'weapons';
                                item.subcategoryTitle = 'Weapons';
                                item.weaponCategory = categoryKey;
                                item.weaponCategoryTitle = categoryData.name;
                            });
                            
                            console.log(`    📊 Category ${categoryKey} complete:`, performance.now() - categoryStart, 'ms, loaded', validResults.length, 'items');
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

    async loadArmorSubcategories() {
        const allArmor = [];
        
        try {
            const response = await fetch(`data/equipment/armor/manifest.json?t=${Date.now()}`);
            if (response.ok) {
                const armorManifest = await response.json();
                
                // Check if armor has subcategories
                if (armorManifest.subcategories && armorManifest.subcategories.length > 0) {
                    // Process each armor subcategory
                    for (const subcategoryData of armorManifest.subcategories) {
                        try {
                            const categoryResponse = await fetch(`data/equipment/armor/${subcategoryData.path}/manifest.json?t=${Date.now()}`);
                            if (categoryResponse.ok) {
                                const categoryManifest = await categoryResponse.json();
                                
                                // Get items from the manifest
                                const armorItems = categoryManifest.items || [];
                                
                                // Load each armor piece in the category
                                const promises = armorItems.map(armorItem => {
                                    const filename = armorItem.file || `${armorItem.id}.md`;
                                    const itemId = armorItem.id;
                                    
                                    return this.loadMetadataOnly(`equipment/armor/${subcategoryData.path}`, filename.replace('.md', '')).then(loadedItem => {
                                        // Ensure the item has an ID in its metadata
                                        if (!loadedItem.metadata.id) {
                                            loadedItem.metadata.id = itemId;
                                        }
                                        return loadedItem;
                                    }).catch(err => {
                                        console.error(`Failed to load armor ${subcategoryData.path}/${filename}:`, err);
                                        return null;
                                    });
                                });
                                
                                // Batch requests to avoid overwhelming server
                            const results = await this.batchPromises(promises, 20);
                                const validResults = results.filter(result => result !== null);
                                
                                // Add armor category info
                                validResults.forEach(item => {
                                    item.subcategory = 'armor';
                                    item.subcategoryTitle = 'Armor';
                                    item.armorCategory = subcategoryData.id;
                                    item.armorCategoryTitle = subcategoryData.name;
                                });
                                
                                allArmor.push(...validResults);
                            }
                        } catch (err) {
                            console.error(`Failed to load armor category ${subcategoryData.id}:`, err);
                        }
                    }
                } else {
                    // Fallback to old structure if no subcategories
                    console.log('No armor subcategories found, using fallback');
                }
            }
        } catch (error) {
            console.error('Error loading armor subcategories:', error);
        }
        
        return allArmor;
    }
    
    async loadShieldSubcategories() {
        const allShields = [];
        
        try {
            const response = await fetch(`data/equipment/shields/manifest.json?t=${Date.now()}`);
            if (response.ok) {
                const shieldsManifest = await response.json();
                
                // Check if shields has subcategories
                if (shieldsManifest.subcategories && shieldsManifest.subcategories.length > 0) {
                    // Process each shield subcategory
                    for (const subcategoryData of shieldsManifest.subcategories) {
                        try {
                            const categoryResponse = await fetch(`data/equipment/shields/${subcategoryData.path}/manifest.json?t=${Date.now()}`);
                            if (categoryResponse.ok) {
                                const categoryManifest = await categoryResponse.json();
                                
                                // Get items from the manifest
                                const shieldItems = categoryManifest.items || [];
                                
                                // Load each shield in the category
                                const promises = shieldItems.map(shieldItem => {
                                    const filename = shieldItem.file || `${shieldItem.id}.md`;
                                    const itemId = shieldItem.id;
                                    
                                    return this.loadMetadataOnly(`equipment/shields/${subcategoryData.path}`, filename.replace('.md', '')).then(loadedItem => {
                                        // Ensure the item has an ID in its metadata
                                        if (!loadedItem.metadata.id) {
                                            loadedItem.metadata.id = itemId;
                                        }
                                        return loadedItem;
                                    }).catch(err => {
                                        console.error(`Failed to load shield ${subcategoryData.path}/${filename}:`, err);
                                        return null;
                                    });
                                });
                                
                                // Batch requests to avoid overwhelming server
                            const results = await this.batchPromises(promises, 20);
                                const validResults = results.filter(result => result !== null);
                                
                                // Add shield category info
                                validResults.forEach(item => {
                                    item.subcategory = 'shields';
                                    item.subcategoryTitle = 'Shields';
                                    item.shieldCategory = subcategoryData.id;
                                    item.shieldCategoryTitle = subcategoryData.name;
                                });
                                
                                allShields.push(...validResults);
                            }
                        } catch (err) {
                            console.error(`Failed to load shield category ${subcategoryData.id}:`, err);
                        }
                    }
                } else {
                    // Fallback to old structure if no subcategories
                    console.log('No shield subcategories found, using fallback');
                }
            }
        } catch (error) {
            console.error('Error loading shield subcategories:', error);
        }
        
        return allShields;
    }
    
    async loadRingSubcategories() {
        const allRings = [];
        
        try {
            const response = await fetch(`data/equipment/rings/manifest.json?t=${Date.now()}`);
            if (response.ok) {
                const ringsManifest = await response.json();
                
                // Check if rings has subcategories
                if (ringsManifest.subcategories && ringsManifest.subcategories.length > 0) {
                    // Process each ring subcategory
                    for (const subcategoryData of ringsManifest.subcategories) {
                        try {
                            const categoryResponse = await fetch(`data/equipment/rings/${subcategoryData.path}/manifest.json?t=${Date.now()}`);
                            if (categoryResponse.ok) {
                                const categoryManifest = await categoryResponse.json();
                                
                                // Get items from the manifest
                                const ringItems = categoryManifest.items || [];
                                
                                // Load each ring in the category
                                const promises = ringItems.map(ringItem => {
                                    const filename = ringItem.file || `${ringItem.id}.md`;
                                    const itemId = ringItem.id;
                                    
                                    return this.loadMetadataOnly(`equipment/rings/${subcategoryData.path}`, filename.replace('.md', '')).then(loadedItem => {
                                        // Ensure the item has an ID in its metadata
                                        if (!loadedItem.metadata.id) {
                                            loadedItem.metadata.id = itemId;
                                        }
                                        return loadedItem;
                                    }).catch(err => {
                                        console.error(`Failed to load ring ${subcategoryData.path}/${filename}:`, err);
                                        return null;
                                    });
                                });
                                
                                // Batch requests to avoid overwhelming server
                            const results = await this.batchPromises(promises, 20);
                                const validResults = results.filter(result => result !== null);
                                
                                // Add ring category info
                                validResults.forEach(item => {
                                    item.subcategory = 'rings';
                                    item.subcategoryTitle = 'Rings';
                                    item.ringCategory = subcategoryData.id;
                                    item.ringCategoryTitle = subcategoryData.name;
                                });
                                
                                allRings.push(...validResults);
                            }
                        } catch (err) {
                            console.error(`Failed to load ring category ${subcategoryData.id}:`, err);
                        }
                    }
                } else {
                    // Fallback to old structure if no subcategories
                    console.log('No ring subcategories found, using fallback');
                }
            }
        } catch (error) {
            console.error('Error loading ring subcategories:', error);
        }
        
        return allRings;
    }

    async loadItemSubcategories() {
        const allItems = [];
        
        try {
            const response = await fetch(`data/equipment/items/manifest.json?t=${Date.now()}`);
            if (response.ok) {
                const itemsManifest = await response.json();
                
                // Check if items has subcategories
                if (itemsManifest.subcategories && itemsManifest.subcategories.length > 0) {
                    // Process each item subcategory
                    for (const subcategoryData of itemsManifest.subcategories) {
                        try {
                            const categoryResponse = await fetch(`data/equipment/items/${subcategoryData.path}/manifest.json?t=${Date.now()}`);
                            if (categoryResponse.ok) {
                                const categoryManifest = await categoryResponse.json();
                                
                                // Get items from the manifest
                                const itemItems = categoryManifest.items || [];
                                
                                // Load each item in the category
                                const promises = itemItems.map(itemItem => {
                                    const filename = itemItem.file || `${itemItem.id}.md`;
                                    const itemId = itemItem.id;
                                    
                                    return this.loadMetadataOnly(`equipment/items/${subcategoryData.path}`, filename.replace('.md', '')).then(loadedItem => {
                                        // Ensure the item has an ID in its metadata
                                        if (!loadedItem.metadata.id) {
                                            loadedItem.metadata.id = itemId;
                                        }
                                        return loadedItem;
                                    }).catch(err => {
                                        console.error(`Failed to load item ${subcategoryData.path}/${filename}:`, err);
                                        return null;
                                    });
                                });
                                
                                // Batch requests to avoid overwhelming server
                            const results = await this.batchPromises(promises, 20);
                                const validResults = results.filter(result => result !== null);
                                
                                // Add item category info
                                validResults.forEach(item => {
                                    item.subcategory = 'items';
                                    item.subcategoryTitle = 'Items';
                                    item.itemCategory = subcategoryData.id;
                                    item.itemCategoryTitle = subcategoryData.name;
                                });
                                
                                allItems.push(...validResults);
                            }
                        } catch (error) {
                            console.error(`Error loading item subcategory ${subcategoryData.path}:`, error);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error loading item subcategories:', error);
        }
        
        return allItems;
    }

    async loadEquipmentListing() {
        const cacheKey = 'category-listing-equipment';
        const startTime = performance.now();
        console.log('🕐 Starting equipment listing load...');
        
        try {
            const manifestStart = performance.now();
            const response = await fetch(`data/equipment/manifest.json?t=${Date.now()}`);
            console.log('📊 Equipment manifest fetch took:', performance.now() - manifestStart, 'ms');
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
                    items: 'Items',
                    catalysts: 'Catalysts'
                };
                
                // Handle new manifest structure with categories array
                const categoriesToProcess = manifest.categories || manifest;
                
                for (const categoryData of (Array.isArray(categoriesToProcess) ? categoriesToProcess : Object.entries(categoriesToProcess))) {
                    let subcategory, data;
                    
                    if (Array.isArray(categoriesToProcess)) {
                        // New structure: {categories: [{id: "weapons", ...}]}
                        subcategory = categoryData.id;
                        data = categoryData;
                    } else {
                        // Old structure: {weapons: [...]}
                        [subcategory, data] = categoryData;
                    }
                    // For new manifest structure, always load subcategories
                    if (subcategory === 'weapons') {
                        // Load weapons subcategories
                        const weaponsStart = performance.now();
                        console.log('🗡️ Loading weapons subcategories...');
                        const weaponsItems = await this.loadWeaponSubcategories();
                        console.log('📊 Weapons loading took:', performance.now() - weaponsStart, 'ms, loaded', weaponsItems.length, 'items');
                        allItems.push(...weaponsItems);
                    } else if (subcategory === 'armor') {
                        // Load armor subcategories
                        const armorStart = performance.now();
                        console.log('🛡️ Loading armor subcategories...');
                        const armorItems = await this.loadArmorSubcategories();
                        console.log('📊 Armor loading took:', performance.now() - armorStart, 'ms, loaded', armorItems.length, 'items');
                        allItems.push(...armorItems);
                    } else if (subcategory === 'shields') {
                        // Load shield subcategories
                        const shieldsStart = performance.now();
                        console.log('🛡️ Loading shield subcategories...');
                        const shieldItems = await this.loadShieldSubcategories();
                        console.log('📊 Shields loading took:', performance.now() - shieldsStart, 'ms, loaded', shieldItems.length, 'items');
                        allItems.push(...shieldItems);
                    } else if (subcategory === 'rings') {
                        // Load ring subcategories
                        const ringsStart = performance.now();
                        console.log('💍 Loading ring subcategories...');
                        const ringItems = await this.loadRingSubcategories();
                        console.log('📊 Rings loading took:', performance.now() - ringsStart, 'ms, loaded', ringItems.length, 'items');
                        allItems.push(...ringItems);
                    } else if (subcategory === 'items') {
                        // Load items subcategories
                        const itemsStart = performance.now();
                        console.log('🎒 Loading items subcategories...');
                        const itemItems = await this.loadItemSubcategories();
                        console.log('📊 Items loading took:', performance.now() - itemsStart, 'ms, loaded', itemItems.length, 'items');
                        allItems.push(...itemItems);
                    }
                    
                    // Handle legacy structure with direct arrays
                    else if (Array.isArray(data)) {
                        // Handle regular arrays (shields, rings, etc.)
                        const promises = data.map(filename => {
                            // Handle both string filenames and object entries
                            const name = typeof filename === 'string' ? filename : filename.name || filename.id;
                            const cleanName = name.replace('.md', '');
                            return this.loadMetadataOnly(`equipment/${subcategory}`, cleanName).catch(err => {
                                console.error(`Failed to load equipment/${subcategory}/${cleanName}:`, err);
                                return null;
                            });
                        });
                        
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
                
                console.log('📊 Total equipment loading took:', performance.now() - startTime, 'ms, loaded', allItems.length, 'total items');
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