#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define all items that need images
const itemsToGenerate = {
    weapons: [
        'dark-hand',
        'dragonslayer-greataxe',
        'farron-greatsword',
        'frayed-blade',
        'friede-scythe',
        'gael-greatsword',
        'lothric-knight-straight-sword',
        'murky-hand-scythe',
        'ringed-knight-paired-greatswords',
        'sellsword-twinblades',
        'splitleaf-greatsword',
        'uchigatana'
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

// Create SVG placeholder
function createSVGPlaceholder(type, itemName, width = 800, height = 600) {
    const scheme = colorSchemes[type];
    const displayName = itemName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect fill="${scheme.bg}" width="${width}" height="${height}"/>
  
  <!-- Gradient overlay -->
  <defs>
    <linearGradient id="gradient-${itemName}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${scheme.accent};stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:${scheme.accent};stop-opacity:0" />
    </linearGradient>
  </defs>
  <rect fill="url(#gradient-${itemName})" width="${width}" height="${height}"/>
  
  <!-- Border -->
  <rect fill="none" stroke="${scheme.accent}" stroke-width="4" x="2" y="2" width="${width - 4}" height="${height - 4}"/>
  
  <!-- Type indicator -->
  <text fill="${scheme.accent}" font-family="Arial" font-size="${Math.min(width, height) * 0.15}" text-anchor="middle" x="${width/2}" y="${height/2}" opacity="0.3">${type.toUpperCase()}</text>
  
  <!-- Item name -->
  <text fill="${scheme.text}" font-family="Arial" font-size="${Math.min(width * 0.06, 24)}" text-anchor="middle" x="${width/2}" y="${height - 30}">${displayName}</text>
  
  <!-- Decorative elements -->
  <circle cx="${width * 0.1}" cy="${height * 0.1}" r="30" fill="${scheme.accent}" opacity="0.1"/>
  <circle cx="${width * 0.9}" cy="${height * 0.9}" r="40" fill="${scheme.accent}" opacity="0.1"/>
</svg>`;
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
    let generated = 0;
    let skipped = 0;
    
    for (const [type, items] of Object.entries(itemsToGenerate)) {
        const typeDir = path.join(baseDir, type);
        ensureDirectoryExists(typeDir);
        
        for (const item of items) {
            const imagePath = path.join(typeDir, `${item}.svg`);
            
            // Skip if image already exists (check for both .png and .svg)
            const pngPath = path.join(typeDir, `${item}.png`);
            if (fs.existsSync(pngPath) || fs.existsSync(imagePath)) {
                console.log(`✓ Skipping ${type}/${item} (already exists)`);
                skipped++;
                continue;
            }
            
            // Generate SVG placeholder
            const svgContent = createSVGPlaceholder(type, item);
            fs.writeFileSync(imagePath, svgContent);
            console.log(`✓ Generated ${type}/${item}.svg`);
            generated++;
        }
    }
    
    console.log(`\n✨ Done! Generated ${generated} placeholders, skipped ${skipped} existing images.`);
}

// Run the generator
generateAllPlaceholders().catch(console.error);