const fs = require('fs');
const path = require('path');

const equipmentDir = path.join(__dirname, '..', 'data', 'equipment');
const outputPath = path.join(equipmentDir, 'manifest.json');

function generateEquipmentManifest() {
    const manifest = {
        categories: [
            {
                id: "weapons",
                name: "Weapons",
                description: "All weapon types in Dark Souls",
                subcategories: []
            },
            {
                id: "armor",
                name: "Armor",
                description: "All armor sets and pieces",
                subcategories: []
            },
            {
                id: "shields",
                name: "Shields", 
                description: "All shield types",
                subcategories: []
            },
            {
                id: "rings",
                name: "Rings",
                description: "All rings and their effects",
                subcategories: []
            },
            {
                id: "items",
                name: "Items",
                description: "Consumables, tools, and other items",
                subcategories: []
            },
            {
                id: "catalysts",
                name: "Catalysts",
                description: "Spell casting tools",
                subcategories: []
            }
        ]
    };
    
    // Read subcategories for each main category
    manifest.categories.forEach(category => {
        const categoryPath = path.join(equipmentDir, category.id);
        if (fs.existsSync(categoryPath)) {
            const subdirs = fs.readdirSync(categoryPath).filter(f => {
                const fullPath = path.join(categoryPath, f);
                return fs.statSync(fullPath).isDirectory();
            });
            
            category.subcategories = subdirs.map(subdir => {
                const subcatManifest = path.join(categoryPath, subdir, 'manifest.json');
                let itemCount = 0;
                
                if (fs.existsSync(subcatManifest)) {
                    try {
                        const items = JSON.parse(fs.readFileSync(subcatManifest, 'utf8'));
                        itemCount = Array.isArray(items) ? items.length : 0;
                    } catch (e) {
                        console.error(`Error reading ${subcatManifest}:`, e);
                    }
                }
                
                return {
                    id: subdir,
                    name: subdir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    count: itemCount
                };
            });
        }
    });
    
    // Write manifest
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    console.log('Generated equipment manifest');
}

// Run the generator
generateEquipmentManifest();