// Create final SVG replacements for remaining low-res weapons
const fs = require('fs');
const path = require('path');

const weaponsDir = path.join(__dirname, '../assets/images/weapons');

// High-quality SVG designs for remaining weapons
const finalSVGs = {
    'estoc': `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
    <defs>
        <linearGradient id="estoc-blade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f0f0f0"/>
            <stop offset="50%" style="stop-color:#d0d0d0"/>
            <stop offset="100%" style="stop-color:#909090"/>
        </linearGradient>
        <radialGradient id="estoc-bg">
            <stop offset="0%" style="stop-color:rgba(212,175,55,0.1)"/>
            <stop offset="100%" style="stop-color:rgba(26,26,26,1)"/>
        </radialGradient>
    </defs>
    
    <rect width="400" height="600" fill="url(#estoc-bg)"/>
    
    <!-- Estoc blade - very thin and long -->
    <g transform="translate(200, 300)">
        <path d="M0,-250 L2,-50 L0,50 L-2,-50 Z" fill="url(#estoc-blade)" stroke="#666" stroke-width="0.5"/>
        <line x1="0" y1="-240" x2="0" y2="-60" stroke="#fff" stroke-width="0.5" opacity="0.4"/>
        
        <!-- Cross guard -->
        <rect x="-40" y="50" width="80" height="6" fill="#8B7355" stroke="#654321"/>
        <circle cx="-40" cy="53" r="4" fill="#CD853F"/>
        <circle cx="40" cy="53" r="4" fill="#CD853F"/>
        
        <!-- Handle -->
        <rect x="-5" y="56" width="10" height="60" fill="#4a3c28" stroke="#2a1c08"/>
        <!-- Handle wrap pattern -->
        <path d="M-5,60 L5,65 M-5,65 L5,70 M-5,70 L5,75 M-5,75 L5,80 M-5,80 L5,85 M-5,85 L5,90 M-5,90 L5,95 M-5,95 L5,100 M-5,100 L5,105 M-5,105 L5,110" 
              stroke="#1a0c00" stroke-width="1" opacity="0.5"/>
        
        <!-- Pommel -->
        <circle cx="0" cy="120" r="10" fill="#8B7355" stroke="#654321"/>
    </g>
    
    <text x="200" y="500" text-anchor="middle" font-family="Cinzel, serif" font-size="28" fill="#d4af37">ESTOC</text>
    <text x="200" y="525" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#999">Thrusting Sword</text>
</svg>`,
    
    'longsword': `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
    <defs>
        <linearGradient id="longsword-blade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#e8e8e8"/>
            <stop offset="50%" style="stop-color:#c0c0c0"/>
            <stop offset="100%" style="stop-color:#808080"/>
        </linearGradient>
        <radialGradient id="longsword-bg">
            <stop offset="0%" style="stop-color:rgba(212,175,55,0.1)"/>
            <stop offset="100%" style="stop-color:rgba(26,26,26,1)"/>
        </radialGradient>
    </defs>
    
    <rect width="400" height="600" fill="url(#longsword-bg)"/>
    
    <!-- Longsword -->
    <g transform="translate(200, 300)">
        <!-- Blade -->
        <path d="M0,-230 L8,-50 L5,50 L0,60 L-5,50 L-8,-50 Z" fill="url(#longsword-blade)" stroke="#666" stroke-width="0.5"/>
        <!-- Fuller -->
        <line x1="0" y1="-220" x2="0" y2="-60" stroke="#999" stroke-width="2" opacity="0.4"/>
        <!-- Blade highlight -->
        <path d="M-4,-220 L-3,-60" stroke="#fff" stroke-width="0.5" opacity="0.4"/>
        
        <!-- Cross guard -->
        <rect x="-50" y="50" width="100" height="8" fill="#8B7355" stroke="#654321"/>
        <rect x="-3" y="48" width="6" height="12" fill="#8B7355"/>
        
        <!-- Handle -->
        <rect x="-6" y="58" width="12" height="70" fill="#4a3c28" stroke="#2a1c08"/>
        <!-- Leather wrap -->
        <g opacity="0.4">
            <path d="M-6,62 L6,68 M-6,68 L6,74 M-6,74 L6,80 M-6,80 L6,86 M-6,86 L6,92 M-6,92 L6,98 M-6,98 L6,104 M-6,104 L6,110 M-6,110 L6,116 M-6,116 L6,122" 
                  stroke="#1a0c00" stroke-width="1.5"/>
        </g>
        
        <!-- Pommel -->
        <ellipse cx="0" cy="135" rx="12" ry="15" fill="#8B7355" stroke="#654321"/>
        <circle cx="0" cy="135" r="8" fill="#654321" opacity="0.5"/>
    </g>
    
    <text x="200" y="500" text-anchor="middle" font-family="Cinzel, serif" font-size="28" fill="#d4af37">LONGSWORD</text>
    <text x="200" y="525" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#999">Straight Sword</text>
</svg>`,
    
    'friede-scythe': `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
    <defs>
        <linearGradient id="scythe-blade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#b0c4de"/>
            <stop offset="50%" style="stop-color:#87ceeb"/>
            <stop offset="100%" style="stop-color:#6495ed"/>
        </linearGradient>
        <radialGradient id="frost-glow">
            <stop offset="0%" style="stop-color:#87ceeb;stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#4682b4;stop-opacity:0.2"/>
        </radialGradient>
        <filter id="frost-effect">
            <feGaussianBlur stdDeviation="4"/>
        </filter>
    </defs>
    
    <rect width="400" height="600" fill="#0a0a0a"/>
    <circle cx="200" cy="250" r="150" fill="url(#frost-glow)" filter="url(#frost-effect)"/>
    
    <!-- Friede's Scythe -->
    <g transform="translate(200, 300)">
        <!-- Handle -->
        <rect x="-4" y="-150" width="8" height="280" fill="#2c2c2c" stroke="#444"/>
        
        <!-- Scythe blade -->
        <path d="M0,-150 Q60,-140 100,-100 Q120,-60 110,-20 Q100,10 70,30 L60,25 Q85,5 95,-25 Q105,-60 85,-95 Q50,-130 0,-140 Z" 
              fill="url(#scythe-blade)" stroke="#4682b4" stroke-width="2" opacity="0.9"/>
        
        <!-- Frost crystals on blade -->
        <g opacity="0.6">
            <polygon points="20,-120 25,-115 20,-110 15,-115" fill="#e0ffff"/>
            <polygon points="50,-100 55,-95 50,-90 45,-95" fill="#e0ffff"/>
            <polygon points="80,-70 85,-65 80,-60 75,-65" fill="#e0ffff"/>
        </g>
        
        <!-- Ice effect on edge -->
        <path d="M0,-140 Q55,-130 90,-95 Q110,-60 100,-25 Q90,5 65,25" 
              stroke="#e0ffff" stroke-width="1" fill="none" opacity="0.8"/>
        
        <!-- Handle details -->
        <circle cx="0" cy="135" r="8" fill="#4682b4" opacity="0.6"/>
        <rect x="-6" y="80" width="12" height="50" fill="#1a1a1a"/>
    </g>
    
    <text x="200" y="500" text-anchor="middle" font-family="Cinzel, serif" font-size="26" fill="#87ceeb">FRIEDE'S SCYTHE</text>
    <text x="200" y="525" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6495ed">Frost Reaper</text>
</svg>`,
    
    'murky-hand-scythe': `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
    <defs>
        <radialGradient id="murky-gradient">
            <stop offset="0%" style="stop-color:#4B0082"/>
            <stop offset="50%" style="stop-color:#2F0147"/>
            <stop offset="100%" style="stop-color:#000000"/>
        </radialGradient>
        <filter id="dark-blur">
            <feGaussianBlur stdDeviation="3"/>
        </filter>
    </defs>
    
    <rect width="400" height="600" fill="#000"/>
    <ellipse cx="200" cy="300" rx="120" ry="180" fill="url(#murky-gradient)" opacity="0.4" filter="url(#dark-blur)"/>
    
    <!-- Murky Hand Scythe -->
    <g transform="translate(200, 300)">
        <!-- Small handle -->
        <rect x="-3" y="-50" width="6" height="120" fill="#1a0a2e" stroke="#16003b"/>
        
        <!-- Small curved blade -->
        <path d="M0,-50 Q30,-45 45,-25 Q55,-5 50,15 Q45,30 30,40 L25,37 Q38,28 43,15 Q48,-2 40,-18 Q25,-38 0,-43 Z" 
              fill="#4B0082" stroke="#6A0DAD" stroke-width="1.5" opacity="0.8"/>
        
        <!-- Dark energy effect -->
        <path d="M0,-43 Q27,-38 40,-20 Q48,-3 44,13 Q40,25 28,35" 
              stroke="#8B008B" stroke-width="2" fill="none" opacity="0.6" filter="url(#dark-blur)"/>
        
        <!-- Murky drips -->
        <ellipse cx="15" cy="-20" rx="2" ry="4" fill="#4B0082" opacity="0.7"/>
        <ellipse cx="30" cy="0" rx="2" ry="5" fill="#4B0082" opacity="0.7"/>
        <ellipse cx="35" cy="20" rx="2" ry="4" fill="#4B0082" opacity="0.7"/>
        
        <!-- Handle wrap -->
        <rect x="-4" y="40" width="8" height="25" fill="#16003b"/>
        <ellipse cx="0" cy="70" r="6" fill="#2F0147"/>
    </g>
    
    <text x="200" y="500" text-anchor="middle" font-family="Cinzel, serif" font-size="24" fill="#8B008B">MURKY HAND SCYTHE</text>
    <text x="200" y="525" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6A0DAD">Dark Dagger</text>
</svg>`
};

// Check and replace low-res PNGs with high-quality SVGs
Object.entries(finalSVGs).forEach(([weapon, svg]) => {
    const pngPath = path.join(weaponsDir, `${weapon}.png`);
    const svgPath = path.join(weaponsDir, `${weapon}.svg`);
    
    // Check if PNG exists and is low-res
    if (fs.existsSync(pngPath)) {
        const stats = fs.statSync(pngPath);
        if (stats.size < 10000) {
            // Remove low-res PNG
            fs.unlinkSync(pngPath);
            console.log(`Removed low-res PNG: ${weapon}.png (${stats.size}B)`);
            
            // Create high-quality SVG
            fs.writeFileSync(svgPath, svg);
            console.log(`✓ Created high-quality SVG: ${weapon}.svg`);
        }
    } else if (!fs.existsSync(svgPath)) {
        // No image exists, create SVG
        fs.writeFileSync(svgPath, svg);
        console.log(`✓ Created SVG for missing weapon: ${weapon}.svg`);
    }
});

console.log('\n✨ Final SVG creation complete!');