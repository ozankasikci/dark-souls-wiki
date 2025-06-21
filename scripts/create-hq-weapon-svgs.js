// Create high-quality SVG weapon graphics for missing/low-res images
const fs = require('fs');
const path = require('path');

const weaponsDir = path.join(__dirname, '../assets/images/weapons');

// Check which images need replacement (< 10KB)
const needsReplacement = [];
fs.readdirSync(weaponsDir).forEach(file => {
    if (file.endsWith('.png')) {
        const filePath = path.join(weaponsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.size < 10000) {
            needsReplacement.push(file.replace('.png', ''));
        }
    }
});

console.log('Creating high-quality SVGs for:', needsReplacement);

// Detailed weapon shapes
const weaponDesigns = {
    'estoc': {
        name: 'Estoc',
        type: 'Thrusting Sword',
        svg: `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
    <defs>
        <linearGradient id="blade-estoc" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#e8e8e8"/>
            <stop offset="50%" style="stop-color:#c0c0c0"/>
            <stop offset="100%" style="stop-color:#808080"/>
        </linearGradient>
        <linearGradient id="guard-estoc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#8B7355"/>
            <stop offset="50%" style="stop-color:#CD853F"/>
            <stop offset="100%" style="stop-color:#8B7355"/>
        </linearGradient>
        <filter id="metal-shine">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feSpecularLighting result="specOut" specularConstant="1.5" specularExponent="20" lighting-color="white">
                <fePointLight x="200" y="100" z="200"/>
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2"/>
            <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
        </filter>
    </defs>
    
    <!-- Background gradient -->
    <rect width="400" height="600" fill="url(#bg-gradient)" opacity="0.3"/>
    
    <!-- Blade -->
    <path d="M200 50 L202 400 L200 420 L198 400 Z" 
          fill="url(#blade-estoc)" 
          stroke="#666" 
          stroke-width="0.5"
          filter="url(#metal-shine)"/>
    
    <!-- Fuller (blade groove) -->
    <path d="M200 60 L200.5 380" 
          stroke="#999" 
          stroke-width="1" 
          opacity="0.6"/>
    
    <!-- Cross-guard -->
    <rect x="150" y="400" width="100" height="8" 
          fill="url(#guard-estoc)" 
          stroke="#654321" 
          stroke-width="1"/>
    <ellipse cx="150" cy="404" rx="8" ry="6" fill="#CD853F"/>
    <ellipse cx="250" cy="404" rx="8" ry="6" fill="#CD853F"/>
    
    <!-- Grip -->
    <rect x="195" y="408" width="10" height="80" 
          fill="#4a3c28" 
          stroke="#2a1c08" 
          stroke-width="1"/>
    
    <!-- Grip wrapping -->
    <g opacity="0.4">
        <path d="M195 415 L205 425 M195 425 L205 435 M195 435 L205 445 M195 445 L205 455 M195 455 L205 465 M195 465 L205 475" 
              stroke="#1a0c00" 
              stroke-width="1.5"/>
    </g>
    
    <!-- Pommel -->
    <circle cx="200" cy="495" r="12" 
            fill="url(#guard-estoc)" 
            stroke="#654321" 
            stroke-width="1"/>
    <circle cx="200" cy="495" r="8" 
            fill="#8B7355" 
            opacity="0.6"/>
    
    <!-- Highlight on blade -->
    <path d="M199.5 70 L199.5 350" 
          stroke="white" 
          stroke-width="0.5" 
          opacity="0.4"/>
    
    <!-- Text -->
    <text x="200" y="550" text-anchor="middle" font-family="Cinzel, serif" font-size="24" fill="#ccc">ESTOC</text>
    <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#999">Thrusting Sword</text>
</svg>`
    },
    'dark-hand': {
        name: 'Dark Hand',
        type: 'Fist Weapon',
        svg: `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
    <defs>
        <radialGradient id="dark-gradient">
            <stop offset="0%" style="stop-color:#8B0000"/>
            <stop offset="50%" style="stop-color:#4B0000"/>
            <stop offset="100%" style="stop-color:#000000"/>
        </radialGradient>
        <filter id="dark-glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    
    <!-- Dark energy background -->
    <circle cx="200" cy="300" r="150" fill="url(#dark-gradient)" opacity="0.3" filter="url(#dark-glow)"/>
    
    <!-- Hand/Gauntlet shape -->
    <g transform="translate(200, 300)">
        <!-- Palm -->
        <ellipse cx="0" cy="0" rx="80" ry="100" fill="#1a0000" stroke="#8B0000" stroke-width="2"/>
        
        <!-- Fingers -->
        <rect x="-60" y="-100" width="25" height="70" rx="12" fill="#1a0000" stroke="#8B0000" stroke-width="2"/>
        <rect x="-25" y="-110" width="25" height="80" rx="12" fill="#1a0000" stroke="#8B0000" stroke-width="2"/>
        <rect x="10" y="-110" width="25" height="80" rx="12" fill="#1a0000" stroke="#8B0000" stroke-width="2"/>
        <rect x="45" y="-100" width="25" height="70" rx="12" fill="#1a0000" stroke="#8B0000" stroke-width="2"/>
        
        <!-- Thumb -->
        <ellipse cx="-70" cy="-20" rx="20" ry="35" transform="rotate(-30 -70 -20)" fill="#1a0000" stroke="#8B0000" stroke-width="2"/>
        
        <!-- Dark energy veins -->
        <path d="M0,0 Q-30,-50 -50,-90 M0,0 Q0,-60 0,-100 M0,0 Q30,-50 50,-90" 
              stroke="#FF0000" 
              stroke-width="1.5" 
              fill="none" 
              opacity="0.6"
              filter="url(#dark-glow)"/>
        
        <!-- Central dark orb -->
        <circle cx="0" cy="0" r="30" fill="#000" opacity="0.8"/>
        <circle cx="0" cy="0" r="25" fill="none" stroke="#8B0000" stroke-width="2" opacity="0.8"/>
        <circle cx="0" cy="0" r="20" fill="#4B0000" opacity="0.6" filter="url(#dark-glow)"/>
    </g>
    
    <!-- Text -->
    <text x="200" y="480" text-anchor="middle" font-family="Cinzel, serif" font-size="24" fill="#8B0000">DARK HAND</text>
    <text x="200" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#666">Cursed Fist Weapon</text>
</svg>`
    }
};

// Create SVGs for weapons that need replacement
needsReplacement.forEach(weaponName => {
    const design = weaponDesigns[weaponName];
    if (design) {
        const svgPath = path.join(weaponsDir, `${weaponName}.svg`);
        fs.writeFileSync(svgPath, design.svg);
        console.log(`✓ Created high-quality SVG for ${weaponName}`);
        
        // Remove the low-quality PNG
        const pngPath = path.join(weaponsDir, `${weaponName}.png`);
        if (fs.existsSync(pngPath)) {
            fs.unlinkSync(pngPath);
            console.log(`  Removed low-quality PNG for ${weaponName}`);
        }
    }
});

console.log('\n✨ SVG creation complete!');