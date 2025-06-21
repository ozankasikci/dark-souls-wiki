// Image loader with Fextralife fallback and placeholder support
class ImageLoader {
    constructor() {
        this.imageCache = new Map();
        this.placeholders = {
            boss: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCBmaWxsPSIjMWExYTFhIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIvPgogIDx0ZXh0IGZpbGw9IiM2NjY2NjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iNDAwIiB5PSI0MDAiPkJvc3MgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==',
            weapon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCBmaWxsPSIjMWExYTFhIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIvPgogIDx0ZXh0IGZpbGw9IiM2NjY2NjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iNDAwIiB5PSIzMDAiPldlYXBvbiBJbWFnZTwvdGV4dD4KPC9zdmc+',
            item: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCBmaWxsPSIjMWExYTFhIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIvPgogIDx0ZXh0IGZpbGw9IiM2NjY2NjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMTI4IiB5PSIxMjgiPkl0ZW0gSWNvbjwvdGV4dD4KPC9zdmc+',
            area: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3QgZmlsbD0iIzFhMWExYSIgd2lkdGg9IjE5MjAiIGhlaWdodD0iNjAwIi8+CiAgPHRleHQgZmlsbD0iIzY2NjY2NiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiB4PSI5NjAiIHk9IjMwMCI+QXJlYSBJbWFnZTwvdGV4dD4KPC9zdmc+',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCBmaWxsPSIjMWExYTFhIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIvPgogIDx0ZXh0IGZpbGw9IiM2NjY2NjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMjAwIiB5PSIxNTAiPlRodW1ibmFpbDwvdGV4dD4KPC9zdmc+'
        };
        
        // Fextralife image URL patterns
        this.fextraUrls = {
            bosses: {
                'asylum-demon': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/asylum_demon.jpg',
                'vordt': 'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/vordt_of_the_boreal_valley.jpg',
                'crystal-sage': 'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/crystal_sage.jpg',
                'abyss-watchers': 'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/abyss_watchers.jpg',
                'taurus-demon': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/taurus_demon.jpg',
                'bell-gargoyles': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/bell_gargoyle.jpg'
            },
            weapons: {
                'zweihander': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/zweihander.png',
                'uchigatana': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/uchigatana.png',
                'claymore': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/claymore.png'
            },
            items: {
                'ring-of-favor': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/ring_of_favor_and_protection.png',
                'elite-knight-set': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/elite_knight_set.jpg'
            },
            npcs: {
                'solaire-of-astora': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/solaire_of_astora.jpg',
                'siegmeyer-of-catarina': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/siegmeyer_of_catarina.jpg',
                'patches': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/patches_the_hyena.jpg',
                'patches-ds1': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/patches_the_hyena.jpg',
                'oscar-of-astora': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/oscar_of_astora.jpg'
            }
        };
    }

    // Get image path with fallback logic
    async getImage(type, id, imageType = 'portrait') {
        const cacheKey = `${type}/${id}/${imageType}`;
        
        // Check cache first
        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }

        // Handle equipment category which uses subcategories (weapons, armor, etc)
        if (type === 'equipment') {
            // Try various subcategories and extensions
            const subcategories = ['weapons', 'armor', 'shields', 'rings', 'catalysts'];
            const extensions = ['.png', '.jpg', '.jpeg'];
            
            for (const subcat of subcategories) {
                for (const ext of extensions) {
                    const path = `assets/images/${subcat}/${id}${ext}`;
                    const exists = await this.checkImageExists(path);
                    if (exists) {
                        this.imageCache.set(cacheKey, path);
                        return path;
                    }
                }
            }
        }

        // Try local image with multiple extensions (including SVG)
        const extensions = ['.png', '.jpg', '.jpeg', '.svg'];
        
        for (const ext of extensions) {
            let localPath;
            if (type === 'weapons' && (imageType === 'icon' || imageType === 'full' || imageType === 'thumbnail')) {
                // For weapons, images are directly in the weapons folder
                localPath = `assets/images/${type}/${id}${ext}`;
            } else if (imageType === 'thumbnail' || imageType === 'portrait') {
                // Try simple path first for thumbnails/portraits
                localPath = `assets/images/${type}/${id}${ext}`;
            } else {
                // Original path structure for other types
                localPath = `assets/images/${type}/${id}/${imageType}${ext}`;
            }
            
            const imageExists = await this.checkImageExists(localPath);
            
            if (imageExists) {
                // For SVG files, verify they're not too small (invalid)
                if (ext === '.svg' || await this.isValidImage(localPath)) {
                    this.imageCache.set(cacheKey, localPath);
                    return localPath;
                }
            }
        }

        // Also try without imageType for backwards compatibility
        for (const ext of extensions) {
            const simplePath = `assets/images/${type}/${id}${ext}`;
            const simpleExists = await this.checkImageExists(simplePath);
            
            if (simpleExists) {
                if (ext === '.svg' || await this.isValidImage(simplePath)) {
                    this.imageCache.set(cacheKey, simplePath);
                    return simplePath;
                }
            }
        }

        // Try Fextralife URL if available
        if (this.fextraUrls[type] && this.fextraUrls[type][id] && imageType === 'portrait') {
            this.imageCache.set(cacheKey, this.fextraUrls[type][id]);
            return this.fextraUrls[type][id];
        }

        // Return placeholder
        const placeholderType = this.getPlaceholderType(type);
        this.imageCache.set(cacheKey, this.placeholders[placeholderType]);
        return this.placeholders[placeholderType];
    }

    // Check if local image exists
    async checkImageExists(path) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
    
    // Validate image is actually an image and has reasonable size
    async isValidImage(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) return false;
            
            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');
            
            // Check if it's an image type
            if (!contentType || !contentType.startsWith('image/')) {
                return false;
            }
            
            // Check minimum size (at least 1KB)
            if (contentLength && parseInt(contentLength) < 1000) {
                return false;
            }
            
            return true;
        } catch {
            return false;
        }
    }

    // Get appropriate placeholder type
    getPlaceholderType(type) {
        const typeMap = {
            bosses: 'boss',
            weapons: 'weapon',
            items: 'item',
            areas: 'area',
            npcs: 'boss'
        };
        return typeMap[type] || 'thumbnail';
    }

    // Create image element with loading states
    createImageElement(src, alt, className = '') {
        const img = document.createElement('img');
        img.className = `wiki-image ${className}`;
        img.alt = alt;
        img.loading = 'lazy';
        
        // Add loading class
        img.classList.add('loading');
        
        // Set up load handlers
        img.onload = () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
        };
        
        img.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
            // Fallback to placeholder on error
            if (!img.src.includes('data:image')) {
                const type = className.includes('boss') ? 'boss' : 
                           className.includes('weapon') ? 'weapon' : 
                           className.includes('item') ? 'item' : 'thumbnail';
                img.src = this.placeholders[type];
            }
        };
        
        img.src = src;
        return img;
    }

    // Create responsive picture element
    createPictureElement(baseSrc, alt, sizes = {}) {
        const picture = document.createElement('picture');
        
        // Add source elements for different sizes if provided
        Object.entries(sizes).forEach(([breakpoint, src]) => {
            const source = document.createElement('source');
            source.media = `(min-width: ${breakpoint})`;
            source.srcset = src;
            picture.appendChild(source);
        });
        
        // Add default img element
        const img = this.createImageElement(baseSrc, alt);
        picture.appendChild(img);
        
        return picture;
    }
}

// Initialize global image loader
const imageLoader = new ImageLoader();