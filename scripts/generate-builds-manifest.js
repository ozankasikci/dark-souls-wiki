const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const buildsDir = path.join(__dirname, '..', 'data', 'builds');
const outputPath = path.join(buildsDir, 'manifest.json');

function generateBuildsManifest() {
    const manifest = [];
    
    try {
        const files = fs.readdirSync(buildsDir);
        const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'manifest.json');
        
        mdFiles.forEach(file => {
            const filePath = path.join(buildsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract frontmatter
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (frontmatterMatch) {
                try {
                    const metadata = yaml.load(frontmatterMatch[1]);
                    const id = file.replace('.md', '');
                    
                    manifest.push({
                        id: id,
                        name: metadata.name || id,
                        type: metadata.build_type || 'Unknown',
                        description: metadata.description || '',
                        starting_class: metadata.starting_class || 'Unknown',
                        soul_level: metadata.soul_level || 120,
                        tags: metadata.tags || [],
                        file: file
                    });
                } catch (e) {
                    console.error(`Error parsing frontmatter for ${file}:`, e);
                }
            }
        });
        
        // Sort by name
        manifest.sort((a, b) => a.name.localeCompare(b.name));
        
        // Write manifest
        fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
        console.log(`Generated builds manifest with ${manifest.length} builds`);
        
    } catch (error) {
        console.error('Error generating builds manifest:', error);
    }
}

// Run the generator
generateBuildsManifest();