const fs = require('fs');
const path = require('path');
const https = require('https');
const { JSDOM } = require('jsdom');

// Map our weapon IDs to Fextralife page names
const weaponUrlMap = {
    // Daggers
    'dagger': 'Dagger',
    'parrying-dagger': 'Parrying+Dagger',
    'ghost-blade': 'Ghost+Blade',
    'bandits-knife': 'Bandit\'s+Knife',
    'priscillas-dagger': 'Priscilla\'s+Dagger',
    'dark-silver-tracer': 'Dark+Silver+Tracer',
    
    // Straight Swords
    'straight-sword-hilt': 'Straight+Sword+Hilt',
    'broken-straight-sword': 'Broken+Straight+Sword',
    'broadsword': 'Broadsword',
    'shortsword': 'Shortsword',
    'longsword': 'Longsword',
    'barbed-straight-sword': 'Barbed+Straight+Sword',
    'balder-side-sword': 'Balder+Side+Sword',
    'crystal-straight-sword': 'Crystal+Straight+Sword',
    'sunlight-straight-sword': 'Sunlight+Straight+Sword',
    'astoras-straight-sword': 'Astora\'s+Straight+Sword',
    'drake-sword': 'Drake+Sword',
    'darksword': 'Darksword',
    'silver-knight-straight-sword': 'Silver+Knight+Straight+Sword',
    
    // Greatswords
    'bastard-sword': 'Bastard+Sword',
    'claymore': 'Claymore',
    'mans-serpent-greatsword': 'Man-serpent+Greatsword',
    'flamberge': 'Flamberge',
    'crystal-greatsword': 'Crystal+Greatsword',
    'stone-greatsword': 'Stone+Greatsword',
    'greatsword-of-artorias': 'Greatsword+of+Artorias',
    'greatsword-of-artorias-cursed': 'Greatsword+of+Artorias+(Cursed)',
    'great-lord-greatsword': 'Great+Lord+Greatsword',
    'obsidian-greatsword': 'Obsidian+Greatsword',
    'moonlight-greatsword': 'Moonlight+Greatsword',
    'black-knight-sword': 'Black+Knight+Sword',
    'abyss-greatsword': 'Abyss+Greatsword',
    
    // Ultra Greatswords
    'zweihander': 'Zweihander',
    'greatsword': 'Greatsword',
    'demon-great-machete': 'Demon+Great+Machete',
    'dragon-greatsword': 'Dragon+Greatsword',
    'black-knight-greatsword': 'Black+Knight+Greatsword',
    
    // Curved Swords
    'scimitar': 'Scimitar',
    'falchion': 'Falchion',
    'shotel': 'Shotel',
    'jagged-ghost-blade': 'Jagged+Ghost+Blade',
    'painting-guardian-sword': 'Painting+Guardian+Sword',
    'quelaags-furysword': 'Quelaag\'s+Furysword',
    
    // Katanas
    'uchigatana': 'Uchigatana',
    'washing-pole': 'Washing+Pole',
    'iaito': 'Iaito',
    'chaos-blade': 'Chaos+Blade',
    
    // Curved Greatswords
    'server': 'Server',
    'murakumo': 'Murakumo',
    'gravelord-sword': 'Gravelord+Sword',
    
    // Piercing Swords
    'rapier': 'Rapier',
    'estoc': 'Estoc',
    'mail-breaker': 'Mail+Breaker',
    'ricards-rapier': 'Ricard\'s+Rapier',
    'velkas-rapier': 'Velka\'s+Rapier',
    
    // Axes
    'hand-axe': 'Hand+Axe',
    'battle-axe': 'Battle+Axe',
    'crescent-axe': 'Crescent+Axe',
    'butcher-knife': 'Butcher+Knife',
    'golem-axe': 'Golem+Axe',
    'gargoyle-tail-axe': 'Gargoyle+Tail+Axe',
    
    // Great Axes
    'greataxe': 'Greataxe',
    'demons-greataxe': 'Demon\'s+Greataxe',
    'dragon-king-greataxe': 'Dragon+King+Greataxe',
    'black-knight-greataxe': 'Black+Knight+Greataxe',
    
    // Hammers
    'club': 'Club',
    'mace': 'Mace',
    'morning-star': 'Morning+Star',
    'warpick': 'Warpick',
    'reinforced-club': 'Reinforced+Club',
    'blacksmiths-hammer': 'Blacksmith\'s+Hammer',
    'hammer-of-vamos': 'Hammer+of+Vamos',
    
    // Great Hammers
    'great-club': 'Great+Club',
    'grants': 'Grant',
    'demons-great-hammer': 'Demon\'s+Great+Hammer',
    'dragon-tooth': 'Dragon+Tooth',
    'large-club': 'Large+Club',
    'smoughs-hammer': 'Smough\'s+Hammer',
    
    // Fist Weapons
    'caestus': 'Caestus',
    'claw': 'Claw',
    'dragon-bone-fist': 'Dragon+Bone+Fist',
    'dark-hand': 'Dark+Hand',
    
    // Spears
    'spear': 'Spear',
    'winged-spear': 'Winged+Spear',
    'partisan': 'Partisan',
    'pike': 'Pike',
    'demons-spear': 'Demon\'s+Spear',
    'silver-knight-spear': 'Silver+Knight+Spear',
    'moonlight-butterfly-horn': 'Moonlight+Butterfly+Horn',
    'dragonslayer-spear': 'Dragonslayer+Spear',
    'channelers-trident': 'Channeler\'s+Trident',
    'four-pronged-plow': 'Four-pronged+Plow',
    
    // Halberds
    'halberd': 'Halberd',
    'gargoyle-halberd': 'Gargoyle\'s+Halberd',
    'titanite-catch-pole': 'Titanite+Catch+Pole',
    'scythe': 'Scythe',
    'lucerne': 'Lucerne',
    'giants-halberd': 'Giant\'s+Halberd',
    'black-knight-halberd': 'Black+Knight+Halberd',
    
    // Whips
    'whip': 'Whip',
    'notched-whip': 'Notched+Whip',
    
    // Bows
    'short-bow': 'Short+Bow',
    'longbow': 'Longbow',
    'composite-bow': 'Composite+Bow',
    'black-bow-of-pharis': 'Black+Bow+of+Pharis',
    
    // Crossbows
    'light-crossbow': 'Light+Crossbow',
    'heavy-crossbow': 'Heavy+Crossbow',
    'sniper-crossbow': 'Sniper+Crossbow',
    'avelyn': 'Avelyn',
    
    // Catalysts
    'sorcerers-catalyst': 'Sorcerer\'s+Catalyst',
    'oolacile-ivory-catalyst': 'Oolacile+Ivory+Catalyst',
    'logans-catalyst': 'Logan\'s+Catalyst',
    'tin-crystallization-catalyst': 'Tin+Crystallization+Catalyst',
    'tin-banishment-catalyst': 'Tin+Banishment+Catalyst',
    'manus-catalyst': 'Manus+Catalyst',
    'tin-darkmoon-catalyst': 'Tin+Darkmoon+Catalyst',
    
    // Talismans
    'talisman': 'Talisman',
    'canvas-talisman': 'Canvas+Talisman',
    'darkmoon-talisman': 'Darkmoon+Talisman',
    
    // Flames
    'pyromancy-flame': 'Pyromancy+Flame',
    'ascended-pyromancy-flame': 'Pyromancy+Flame+%2B15'
};

// Create directories if they don't exist
const imageDir = path.join(__dirname, '..', 'assets', 'images', 'weapons');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Function to download image
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirect
                https.get(response.headers.location, (redirectResponse) => {
                    redirectResponse.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve(filepath);
                    });
                }).on('error', reject);
            } else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filepath);
                });
            }
        }).on('error', reject);
    });
}

// Function to fetch weapon page and extract image
async function fetchWeaponImage(weaponId, fextralifeName) {
    const url = `https://darksouls.wiki.fextralife.com/${fextralifeName}`;
    console.log(`Fetching ${weaponId} from ${url}`);
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                try {
                    const dom = new JSDOM(data);
                    const doc = dom.window.document;
                    
                    // Look for the main weapon image - Fextralife uses /file/Dark-Souls/ pattern
                    const weaponImages = doc.querySelectorAll('img');
                    let weaponImage = null;
                    
                    // Find the first image that matches the Dark Souls file pattern
                    for (const img of weaponImages) {
                        if (img.src && img.src.includes('/file/Dark-Souls/')) {
                            weaponImage = img;
                            break;
                        }
                    }
                    
                    if (weaponImage) {
                        let imgSrc = weaponImage.src;
                        // Make sure we have a full URL
                        if (!imgSrc.startsWith('http')) {
                            imgSrc = 'https://darksouls.wiki.fextralife.com' + imgSrc;
                        }
                        
                        // Download the image
                        const ext = path.extname(imgSrc.split('?')[0]) || '.jpg';
                        const filepath = path.join(imageDir, `${weaponId}${ext}`);
                        
                        await downloadImage(imgSrc, filepath);
                        console.log(`✓ Downloaded ${weaponId}`);
                        resolve({ weaponId, filepath, success: true });
                    } else {
                        console.log(`✗ No image found for ${weaponId}`);
                        resolve({ weaponId, success: false, error: 'No image found' });
                    }
                } catch (error) {
                    console.error(`✗ Error processing ${weaponId}:`, error.message);
                    resolve({ weaponId, success: false, error: error.message });
                }
            });
        }).on('error', (error) => {
            console.error(`✗ Error fetching ${weaponId}:`, error.message);
            resolve({ weaponId, success: false, error: error.message });
        });
    });
}

// Main function
async function fetchAllWeaponImages() {
    console.log('Starting weapon image download...\n');
    
    const results = [];
    const entries = Object.entries(weaponUrlMap);
    
    // Process in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);
        const batchPromises = batch.map(([weaponId, fextralifeName]) => 
            fetchWeaponImage(weaponId, fextralifeName)
        );
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Add a small delay between batches
        if (i + batchSize < entries.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);
    
    console.log('\n=== Summary ===');
    console.log(`Total weapons: ${results.length}`);
    console.log(`Successful downloads: ${successful}`);
    console.log(`Failed downloads: ${failed.length}`);
    
    if (failed.length > 0) {
        console.log('\nFailed weapons:');
        failed.forEach(f => console.log(`- ${f.weaponId}: ${f.error}`));
    }
    
    // Save results for reference
    fs.writeFileSync(
        path.join(__dirname, 'weapon-image-results.json'),
        JSON.stringify(results, null, 2)
    );
}

// Run the script
fetchAllWeaponImages().catch(console.error);