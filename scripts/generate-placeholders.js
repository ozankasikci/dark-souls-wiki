#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Define all items that need images
const itemsToGenerate = {
    weapons: [
        'black-knight-sword',
        'claymore',
        'dark-hand',
        'dragonslayer-greataxe',
        'estoc',
        'farron-greatsword',
        'frayed-blade',
        'friede-scythe',
        'gael-greatsword',
        'longsword',
        'lothric-knight-straight-sword',
        'moonlight-greatsword',
        'murky-hand-scythe',
        'ringed-knight-paired-greatswords',
        'sellsword-twinblades',
        'splitleaf-greatsword',
        'uchigatana',
        'zweihander'
    ],
    bosses: [
        'asylum-demon',
        'vordt',
        'crystal-sage',
        'abyss-watchers',
        'taurus-demon',
        'bell-gargoyles',
        'iudex-gundyr',
        'curse-rotted-greatwood',
        'aldrich-devourer-of-gods',
        'champion-gundyr',
        'dancer-of-the-boreal-valley',
        'darkeater-midir',
        'demon-prince',
        'lothric-younger-prince',
        'nameless-king',
        'pontiff-sulyvahn',
        'sister-friede',
        'slave-knight-gael',
        'soul-of-cinder'
    ],
    items: [
        'estus-flask',
        'ring-of-favor',
        'elite-knight-set',
        'ashen-estus-flask',
        'coiled-sword',
        'fire-keeper-soul'
    ],
    npcs: [
        'solaire-of-astora',
        'siegmeyer-of-catarina',
        'patches',
        'patches-ds1',
        'oscar-of-astora',
        'andre',
        'fire-keeper',
        'hawkwood',
        'ludleth'
    ],
    areas: [
        'firelink-shrine',
        'undead-burg',
        'anor-londo',
        'blighttown',
        'northern-undead-asylum',
        'undead-parish',
        'depths',
        'valley-of-drakes',
        'darkroot-garden',
        'darkroot-basin',
        'new-londo-ruins',
        'sens-fortress',
        'dukes-archives',
        'crystal-cave'
    ],
    armor: [
        'elite-knight-set'
    ],
    shields: [
        'grass-crest-shield'
    ],
    rings: [
        'ring-of-favor'
    ],
    catalysts: [
        'pyromancy-flame'
    ]
};

// Color schemes for different item types
const colorSchemes = {
    weapons: { bg: '#2a2a2a', accent: '#d4af37', text: '#ffffff' },
    bosses: { bg: '#1a0000', accent: '#ff6b6b', text: '#ffffff' },
    items: { bg: '#1a1a2a', accent: '#6b9fff', text: '#ffffff' },
    npcs: { bg: '#2a1a1a', accent: '#ffab6b', text: '#ffffff' },
    areas: { bg: '#1a2a1a', accent: '#6bff9f', text: '#ffffff' },
    armor: { bg: '#2a2a1a', accent: '#9f6bff', text: '#ffffff' },
    shields: { bg: '#1a2a2a', accent: '#ff9f6b', text: '#ffffff' },
    rings: { bg: '#2a1a2a', accent: '#ffef6b', text: '#ffffff' },
    catalysts: { bg: '#1a1a2a', accent: '#6bffef', text: '#ffffff' }
};

// Icons for different types (simple shapes)
const typeIcons = {
    weapons: '⚔️',
    bosses: '👹',
    items: '🏺',
    npcs: '🧙',
    areas: '🏰',
    armor: '🛡️',
    shields: '🛡️',
    rings: '💍',
    catalysts: '🔮'
};

// Create placeholder image
function createPlaceholder(type, itemName, width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const scheme = colorSchemes[type];
    
    // Background
    ctx.fillStyle = scheme.bg;
    ctx.fillRect(0, 0, width, height);
    
    // Border
    ctx.strokeStyle = scheme.accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `${scheme.accent}22`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Center icon
    ctx.font = `${Math.min(width, height) * 0.3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = scheme.accent;
    ctx.fillText(typeIcons[type] || '❓', width / 2, height / 2);
    
    // Item name at bottom
    const displayName = itemName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    ctx.font = `${Math.min(width * 0.06, 16)}px Arial`;
    ctx.fillStyle = scheme.text;
    ctx.fillText(displayName, width / 2, height - 20);
    
    return canvas.toBuffer('image/png');
}

// Ensure directory exists
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Generate all placeholder images
async function generateAllPlaceholders() {
    const baseDir = path.join(__dirname, '..', 'assets', 'images');
    
    for (const [type, items] of Object.entries(itemsToGenerate)) {
        const typeDir = path.join(baseDir, type);
        ensureDirectoryExists(typeDir);
        
        for (const item of items) {
            const imagePath = path.join(typeDir, `${item}.png`);
            
            // Skip if image already exists
            if (fs.existsSync(imagePath)) {
                console.log(`✓ Skipping ${type}/${item} (already exists)`);
                continue;
            }
            
            // Generate placeholder
            const imageBuffer = createPlaceholder(type, item, 800, 600);
            fs.writeFileSync(imagePath, imageBuffer);
            console.log(`✓ Generated ${type}/${item}.png`);
        }
    }
    
    console.log('\n✨ All placeholder images generated!');
}

// Run the generator
generateAllPlaceholders().catch(console.error);