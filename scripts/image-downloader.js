// Image Downloader Helper
// This script helps organize and reference images for the Dark Souls Wiki

const imageData = {
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
        },
        'black-knight-sword': {
            name: 'Black Knight Sword',
            url: 'assets/images/weapons/black-knight-sword.png',
            alt: 'Black Knight Sword'
        },
        'moonlight-greatsword': {
            name: 'Moonlight Greatsword',
            url: 'assets/images/weapons/moonlight-greatsword.png',
            alt: 'Moonlight Greatsword'
        },
        'estoc': {
            name: 'Estoc',
            url: 'assets/images/weapons/estoc.png',
            alt: 'Estoc thrusting sword'
        },
        'longsword': {
            name: 'Longsword',
            url: 'assets/images/weapons/longsword.png',
            alt: 'Longsword'
        }
    },
    bosses: {
        'asylum-demon': {
            name: 'Asylum Demon',
            url: 'assets/images/bosses/asylum-demon.png',
            alt: 'Asylum Demon boss'
        },
        'bell-gargoyles': {
            name: 'Bell Gargoyles',
            url: 'assets/images/bosses/bell-gargoyles.jpg',
            alt: 'Bell Gargoyles boss fight'
        },
        'taurus-demon': {
            name: 'Taurus Demon',
            url: 'assets/images/bosses/taurus-demon.jpg',
            alt: 'Taurus Demon on bridge'
        }
    },
    areas: {
        'firelink-shrine': {
            name: 'Firelink Shrine',
            url: 'assets/images/areas/firelink-shrine.png',
            alt: 'Firelink Shrine bonfire area'
        },
        'undead-burg': {
            name: 'Undead Burg',
            url: 'assets/images/areas/undead-burg.jpg',
            alt: 'Undead Burg medieval town'
        },
        'anor-londo': {
            name: 'Anor Londo',
            url: 'assets/images/areas/anor-londo.jpg',
            alt: 'Anor Londo cathedral city'
        },
        'blighttown': {
            name: 'Blighttown',
            url: 'assets/images/areas/blighttown.jpg',
            alt: 'Blighttown swamp area'
        }
    },
    npcs: {
        'solaire': {
            name: 'Solaire of Astora',
            url: 'assets/images/npcs/solaire.jpg',
            alt: 'Solaire praising the sun'
        },
        'siegmeyer': {
            name: 'Siegmeyer of Catarina',
            url: 'assets/images/npcs/siegmeyer.jpg',
            alt: 'Onion knight Siegmeyer'
        },
        'andre': {
            name: 'Andre the Blacksmith',
            url: 'assets/images/npcs/andre.jpg',
            alt: 'Andre the blacksmith'
        }
    },
    items: {
        'estus-flask': {
            name: 'Estus Flask',
            url: 'assets/images/items/estus-flask.jpg',
            alt: 'Estus Flask healing item'
        },
        'ring-of-favor': {
            name: 'Ring of Favor',
            url: 'assets/images/items/ring-of-favor.jpg',
            alt: 'Ring of Favor and Protection'
        }
    }
};

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