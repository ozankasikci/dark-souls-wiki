// Image Helper Script
// This script provides utilities for managing images in the Dark Souls Wiki

class ImageHelper {
    constructor() {
        this.imageCategories = ['weapons', 'bosses', 'areas', 'npcs', 'items'];
        this.imageSources = {
            weapons: [
                { id: 'zweihander', search: 'Dark Souls Zweihander weapon' },
                { id: 'claymore', search: 'Dark Souls Claymore weapon' },
                { id: 'uchigatana', search: 'Dark Souls Uchigatana katana' },
                { id: 'black-knight-sword', search: 'Dark Souls Black Knight Sword' },
                { id: 'moonlight-greatsword', search: 'Dark Souls Moonlight Greatsword' },
                { id: 'estoc', search: 'Dark Souls Estoc weapon' },
                { id: 'longsword', search: 'Dark Souls Longsword weapon' },
                { id: 'dark-hand', search: 'Dark Souls Dark Hand weapon' }
            ],
            bosses: [
                { id: 'asylum-demon', search: 'Dark Souls Asylum Demon boss' },
                { id: 'bell-gargoyles', search: 'Dark Souls Bell Gargoyles boss' },
                { id: 'taurus-demon', search: 'Dark Souls Taurus Demon boss' },
                { id: 'capra-demon', search: 'Dark Souls Capra Demon boss' },
                { id: 'gaping-dragon', search: 'Dark Souls Gaping Dragon boss' },
                { id: 'quelaag', search: 'Dark Souls Chaos Witch Quelaag boss' }
            ],
            areas: [
                { id: 'firelink-shrine', search: 'Dark Souls Firelink Shrine area' },
                { id: 'undead-burg', search: 'Dark Souls Undead Burg area' },
                { id: 'undead-parish', search: 'Dark Souls Undead Parish area' },
                { id: 'anor-londo', search: 'Dark Souls Anor Londo city' },
                { id: 'blighttown', search: 'Dark Souls Blighttown area' },
                { id: 'sen-fortress', search: 'Dark Souls Sen Fortress area' }
            ],
            npcs: [
                { id: 'solaire', search: 'Dark Souls Solaire of Astora' },
                { id: 'siegmeyer', search: 'Dark Souls Siegmeyer Onion Knight' },
                { id: 'andre', search: 'Dark Souls Andre Blacksmith' },
                { id: 'lautrec', search: 'Dark Souls Knight Lautrec' },
                { id: 'logan', search: 'Dark Souls Big Hat Logan' }
            ],
            items: [
                { id: 'estus-flask', search: 'Dark Souls Estus Flask' },
                { id: 'ring-of-favor', search: 'Dark Souls Ring of Favor' },
                { id: 'humanity', search: 'Dark Souls Humanity item' },
                { id: 'fire-keeper-soul', search: 'Dark Souls Fire Keeper Soul' }
            ]
        };
    }

    // Generate search URLs for manual image finding
    generateSearchUrls() {
        const urls = {};
        
        for (const category of this.imageCategories) {
            urls[category] = [];
            if (this.imageSources[category]) {
                for (const item of this.imageSources[category]) {
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.search)}&tbm=isch`;
                    urls[category].push({
                        id: item.id,
                        searchUrl: searchUrl,
                        filename: `${item.id}.jpg`
                    });
                }
            }
        }
        
        return urls;
    }

    // Generate a download checklist
    generateChecklist() {
        console.log('=== Dark Souls Wiki Image Checklist ===\n');
        
        const urls = this.generateSearchUrls();
        
        for (const [category, items] of Object.entries(urls)) {
            console.log(`\n${category.toUpperCase()}:`);
            console.log('─'.repeat(50));
            
            items.forEach(item => {
                console.log(`[ ] ${item.id}`);
                console.log(`    Search: ${item.searchUrl}`);
                console.log(`    Save as: assets/images/${category}/${item.filename}\n`);
            });
        }
        
        console.log('\n=== Instructions ===');
        console.log('1. Click each search URL to find appropriate images');
        console.log('2. Download high-quality images (preferably 800px+ width)');
        console.log('3. Save with the specified filename in the correct folder');
        console.log('4. Update image-downloader.js if needed');
    }

    // Check which images are missing
    checkMissingImages() {
        const missing = [];
        
        if (window.ImageDatabase) {
            for (const [category, items] of Object.entries(window.ImageDatabase.data)) {
                for (const [id, data] of Object.entries(items)) {
                    // Try to load image to check if it exists
                    const img = new Image();
                    img.onerror = () => {
                        missing.push({
                            category: category,
                            id: id,
                            path: data.url
                        });
                    };
                    img.src = data.url;
                }
            }
        }
        
        // Log results after a delay to allow images to load
        setTimeout(() => {
            if (missing.length > 0) {
                console.log('Missing images:', missing);
            } else {
                console.log('All referenced images are present!');
            }
        }, 2000);
        
        return missing;
    }
}

// Create global instance
window.ImageHelper = new ImageHelper();

// Auto-generate checklist in console
console.log('Image Helper loaded. Use window.ImageHelper.generateChecklist() to see image download URLs.');