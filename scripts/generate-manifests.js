// This script generates manifest.json files for each category
// Run with: node generate-manifests.js

const fs = require('fs');
const path = require('path');

const categories = ['weapons', 'items', 'bosses', 'areas', 'npcs', 'quests', 'lore'];
const dataDir = path.join(__dirname, 'data');

categories.forEach(category => {
    const categoryPath = path.join(dataDir, category);
    
    try {
        // Read all .md files in the category directory
        const files = fs.readdirSync(categoryPath)
            .filter(file => file.endsWith('.md'));
        
        // Create manifest
        const manifestPath = path.join(categoryPath, 'manifest.json');
        fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2));
        
        console.log(`Created manifest for ${category}: ${files.length} files`);
    } catch (error) {
        console.error(`Error processing ${category}:`, error.message);
    }
});

console.log('Manifest generation complete!');