// Image Downloader Helper
// This script helps organize and reference images for the Dark Souls Wiki

// Function to convert id to proper name
function idToName(id) {
    return id.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Build image data from manifest
const imageData = {};

// Check if IMAGE_MANIFEST is available
if (typeof IMAGE_MANIFEST !== 'undefined') {
    // Process each category in the manifest
    Object.entries(IMAGE_MANIFEST).forEach(([category, items]) => {
        imageData[category] = {};
        
        Object.entries(items).forEach(([id, info]) => {
            const name = idToName(id);
            imageData[category][id] = {
                name: name,
                url: `assets/images/${category}/${id}.${info.ext}`,
                alt: `${name} ${category.slice(0, -1)}` // Remove 's' from category for alt text
            };
        });
    });
} else {
    // Fallback hardcoded data if manifest is not available
    Object.assign(imageData, {
        weapons: {
            'zweihander': {
                name: 'Zweihander',
                url: 'assets/images/weapons/zweihander.png',
                alt: 'Zweihander ultra greatsword'
            },
            'claymore': {
                name: 'Claymore',
                url: 'assets/images/weapons/claymore.png',
                alt: 'Claymore greatsword'
            },
            'uchigatana': {
                name: 'Uchigatana',
                url: 'assets/images/weapons/uchigatana.jpg',
                alt: 'Uchigatana katana'
            }
        },
        bosses: {
            'asylum-demon': {
                name: 'Asylum Demon',
                url: 'assets/images/bosses/asylum-demon.jpg',
                alt: 'Asylum Demon boss'
            }
        },
        areas: {
            'firelink-shrine': {
                name: 'Firelink Shrine',
                url: 'assets/images/areas/firelink-shrine.png',
                alt: 'Firelink Shrine bonfire area'
            }
        },
        npcs: {
            'solaire-of-astora': {
                name: 'Solaire of Astora',
                url: 'assets/images/npcs/solaire-of-astora.jpg',
                alt: 'Solaire praising the sun'
            }
        },
        items: {
            'ring-of-favor': {
                name: 'Ring of Favor',
                url: 'assets/images/items/ring-of-favor.svg',
                alt: 'Ring of Favor and Protection'
            }
        }
    });
}

// Function to get image data for a specific item
function getImageData(category, itemId) {
    if (imageData[category] && imageData[category][itemId]) {
        return imageData[category][itemId];
    }
    return null;
}

// Function to create image element
function createImageElement(category, itemId, cssClass = '') {
    const data = getImageData(category, itemId);
    if (!data) return null;
    
    const img = document.createElement('img');
    img.src = data.url;
    img.alt = data.alt;
    img.title = data.name;
    img.className = cssClass;
    img.loading = 'lazy';
    
    // Add error handler for missing images
    img.onerror = function() {
        this.src = 'assets/images/placeholder.svg';
        this.alt = 'Image not available';
    };
    
    return img;
}

// Export for use in other scripts
window.ImageDatabase = {
    data: imageData,
    getImageData,
    createImageElement
};

// Debug log
console.log('ImageDatabase created with data:', imageData);
console.log('Sample weapon data:', imageData.weapons ? Object.keys(imageData.weapons).slice(0, 5) : 'No weapons data');