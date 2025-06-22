const fs = require('fs');
const path = require('path');

// Read the existing manifest
const manifestPath = path.join(__dirname, 'image-manifest.js');
const manifestContent = fs.readFileSync(manifestPath, 'utf-8');

// Extract the current manifest object
const manifestMatch = manifestContent.match(/const IMAGE_MANIFEST = ({[\s\S]*?});/);
if (!manifestMatch) {
    console.error('Could not parse manifest');
    process.exit(1);
}

// Parse the manifest
let manifest;
try {
    // Use Function constructor to safely evaluate the object
    manifest = new Function('return ' + manifestMatch[1])();
} catch (error) {
    console.error('Error parsing manifest:', error);
    process.exit(1);
}

// Get all weapon images
const weaponsDir = path.join(__dirname, '..', 'assets', 'images', 'weapons');
const weaponImages = fs.readdirSync(weaponsDir).filter(f => f.endsWith('.png'));

// Create weapons manifest
const weaponsManifest = {};
weaponImages.forEach(file => {
    const name = path.basename(file, '.png');
    weaponsManifest[name] = {
        ext: 'png'
    };
});

// Add weapons to manifest
manifest.weapons = weaponsManifest;

// Generate new manifest content
const newManifestContent = `// Auto-generated manifest of all existing images in the project
// Generated on: ${new Date().toISOString()}

const IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 4)};

// Make it available globally for other scripts
if (typeof window !== 'undefined') {
    window.IMAGE_MANIFEST = IMAGE_MANIFEST;
}
`;

// Write back to file
fs.writeFileSync(manifestPath, newManifestContent);

console.log(`✓ Updated image manifest with ${Object.keys(weaponsManifest).length} weapon images`);
console.log('Weapon images added:', Object.keys(weaponsManifest).slice(0, 10).join(', '), '...');