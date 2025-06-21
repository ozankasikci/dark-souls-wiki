// Create high-quality SVG placeholders for weapons
const fs = require('fs');
const path = require('path');

const weaponTypes = {
    'black-knight-sword': { type: 'greatsword', color: '#444' },
    'estoc': { type: 'thrusting', color: '#666' },
    'moonlight-greatsword': { type: 'greatsword', color: '#4a90e2' },
    'uchigatana': { type: 'katana', color: '#333' }
};

const weaponShapes = {
    greatsword: `
        <path d="M200 50 L210 350 L200 380 L190 350 Z" fill="currentColor" opacity="0.8"/>
        <rect x="180" y="350" width="40" height="30" fill="currentColor" opacity="0.6"/>
        <rect x="160" y="380" width="80" height="10" fill="#8B4513" opacity="0.8"/>
        <circle cx="200" cy="385" r="3" fill="#FFD700"/>
    `,
    thrusting: `
        <path d="M200 40 L202 340 L200 360 L198 340 Z" fill="currentColor" opacity="0.9"/>
        <ellipse cx="200" cy="350" rx="20" ry="5" fill="currentColor" opacity="0.7"/>
        <rect x="190" y="350" width="20" height="40" fill="#8B4513" opacity="0.8"/>
    `,
    katana: `
        <path d="M200 60 Q210 200 205 340 L200 350 Q195 200 190 60 Z" fill="currentColor" opacity="0.8"/>
        <rect x="190" y="340" width="20" height="50" fill="#4B0000" opacity="0.8"/>
        <rect x="185" y="340" width="30" height="5" fill="#8B4513"/>
    `
};

function createWeaponSVG(weaponName, config) {
    const shape = weaponShapes[config.type] || weaponShapes.greatsword;
    
    return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <defs>
        <radialGradient id="bg-${weaponName}">
            <stop offset="0%" style="stop-color:rgba(212,175,55,0.1)"/>
            <stop offset="100%" style="stop-color:rgba(26,26,26,1)"/>
        </radialGradient>
        <filter id="glow-${weaponName}">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    
    <!-- Background -->
    <rect width="400" height="400" fill="url(#bg-${weaponName})"/>
    
    <!-- Weapon silhouette -->
    <g transform="translate(0, 0)" style="color: ${config.color}" filter="url(#glow-${weaponName})">
        ${shape}
    </g>
    
    <!-- Text label -->
    <text x="200" y="30" text-anchor="middle" fill="#666" font-family="Arial, sans-serif" font-size="14" opacity="0.5">
        ${weaponName.replace(/-/g, ' ').toUpperCase()}
    </text>
</svg>`;
}

// Create placeholders for missing weapons
const outputDir = path.join(__dirname, '../assets/images/weapons');

Object.entries(weaponTypes).forEach(([name, config]) => {
    const filePath = path.join(outputDir, `${name}.svg`);
    const svgContent = createWeaponSVG(name, config);
    
    // Check if PNG exists and is valid
    const pngPath = path.join(outputDir, `${name}.png`);
    try {
        const stats = fs.statSync(pngPath);
        if (stats.size < 1000) {
            // Remove invalid PNG and create SVG placeholder
            fs.unlinkSync(pngPath);
            fs.writeFileSync(filePath, svgContent);
            console.log(`Created placeholder for ${name}`);
        }
    } catch (err) {
        // PNG doesn't exist, create SVG
        fs.writeFileSync(filePath, svgContent);
        console.log(`Created placeholder for ${name}`);
    }
});

console.log('✨ Weapon placeholders created!');