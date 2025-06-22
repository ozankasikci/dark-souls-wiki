const fs = require('fs');
const path = require('path');

function scanDirectory(dir, basePath = '') {
    const result = {};
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            result[file] = scanDirectory(filePath, path.join(basePath, file));
        } else if (/\.(png|jpg|jpeg|svg)$/i.test(file)) {
            const name = file.replace(/\.(png|jpg|jpeg|svg)$/i, '');
            const ext = file.match(/\.(png|jpg|jpeg|svg)$/i)[0].substring(1).toLowerCase();
            
            if (!result[name]) {
                result[name] = { ext };
            } else if (result[name].ext !== ext) {
                if (!result[name].alts) {
                    result[name].alts = [];
                }
                result[name].alts.push(ext);
            }
        }
    });
    
    return result;
}

console.log('Regenerating image manifest...');

const assetsPath = path.join(__dirname, '..', 'assets', 'images');
const manifest = scanDirectory(assetsPath);

const manifestContent = `// Auto-generated manifest of all existing images in the project
// Generated on: ${new Date().toISOString()}

const IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 4)};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IMAGE_MANIFEST;
}
`;

fs.writeFileSync(path.join(__dirname, 'image-manifest.js'), manifestContent);
console.log('Image manifest regenerated successfully!');
console.log(`Total categories: ${Object.keys(manifest).length}`);

// Count total images
let totalImages = 0;
const countImages = (obj) => {
    Object.values(obj).forEach(value => {
        if (value.ext) {
            totalImages++;
        } else {
            countImages(value);
        }
    });
};
countImages(manifest);
console.log(`Total images: ${totalImages}`);