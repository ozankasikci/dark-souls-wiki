#!/usr/bin/env node

/**
 * Image Downloader for Dark Souls Wiki
 * Downloads images from various sources for the wiki
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Image URLs from various sources (using placeholder URLs - replace with actual Dark Souls image URLs)
const imageUrls = {
    weapons: {
        'zweihander': 'https://static.wikia.nocookie.net/darksouls/images/6/67/Zweihander.png',
        'claymore': 'https://static.wikia.nocookie.net/darksouls/images/9/91/Claymore.png',
        'uchigatana': 'https://static.wikia.nocookie.net/darksouls/images/5/54/Uchigatana.png',
        'black-knight-sword': 'https://static.wikia.nocookie.net/darksouls/images/5/57/Black_knight_sword.png',
        'moonlight-greatsword': 'https://static.wikia.nocookie.net/darksouls/images/9/90/Moonlight_Greatsword.png',
        'estoc': 'https://static.wikia.nocookie.net/darksouls/images/8/8d/Estoc.png',
        'longsword': 'https://static.wikia.nocookie.net/darksouls/images/7/74/Long_Sword.png',
        'dark-hand': 'https://static.wikia.nocookie.net/darksouls/images/2/28/Dark_Hand.png'
    },
    bosses: {
        'asylum-demon': 'https://static.wikia.nocookie.net/darksouls/images/4/44/Asylum_Demon.jpg',
        'bell-gargoyles': 'https://static.wikia.nocookie.net/darksouls/images/3/3e/Bell_Gargoyle.jpg',
        'taurus-demon': 'https://static.wikia.nocookie.net/darksouls/images/6/6f/Taurus_Demon.jpg'
    },
    areas: {
        'firelink-shrine': 'https://static.wikia.nocookie.net/darksouls/images/e/ef/Firelink_Shrine.jpg',
        'undead-burg': 'https://static.wikia.nocookie.net/darksouls/images/f/fd/Undead_Burg.jpg',
        'anor-londo': 'https://static.wikia.nocookie.net/darksouls/images/6/6a/Anor_Londo.jpg',
        'blighttown': 'https://static.wikia.nocookie.net/darksouls/images/3/3e/Blighttown.jpg'
    },
    npcs: {
        'solaire': 'https://static.wikia.nocookie.net/darksouls/images/4/44/Solaire.jpg',
        'siegmeyer': 'https://static.wikia.nocookie.net/darksouls/images/0/05/Siegmeyer.jpg',
        'andre': 'https://static.wikia.nocookie.net/darksouls/images/a/a5/Andre.jpg'
    },
    items: {
        'estus-flask': 'https://static.wikia.nocookie.net/darksouls/images/f/fd/Estus_Flask.png',
        'ring-of-favor': 'https://static.wikia.nocookie.net/darksouls/images/9/9c/Ring_of_favor_and_protection.png'
    }
};

// Alternative sources if primary fails
const alternativeUrls = {
    weapons: {
        'zweihander': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/zweihander.png',
        'claymore': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/claymore.png',
        'uchigatana': 'https://darksouls.wiki.fextralife.com/file/Dark-Souls/uchigatana-lg.png'
    }
};

class ImageDownloader {
    constructor() {
        this.baseDir = path.join(__dirname, '..', 'assets', 'images');
        this.downloaded = 0;
        this.failed = 0;
        this.total = 0;
    }

    async downloadImage(url, filepath) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            const file = fs.createWriteStream(filepath);

            const request = protocol.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }, (response) => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                } else if (response.statusCode === 301 || response.statusCode === 302) {
                    // Handle redirects
                    file.close();
                    fs.unlinkSync(filepath);
                    this.downloadImage(response.headers.location, filepath)
                        .then(resolve)
                        .catch(reject);
                } else {
                    file.close();
                    fs.unlinkSync(filepath);
                    reject(new Error(`Failed to download: ${response.statusCode}`));
                }
            });

            request.on('error', (err) => {
                file.close();
                fs.unlinkSync(filepath);
                reject(err);
            });

            file.on('error', (err) => {
                fs.unlinkSync(filepath);
                reject(err);
            });
        });
    }

    async downloadCategory(category, urls) {
        const categoryDir = path.join(this.baseDir, category);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }

        console.log(`\nDownloading ${category}...`);
        console.log('─'.repeat(50));

        for (const [id, url] of Object.entries(urls)) {
            this.total++;
            const extension = path.extname(new URL(url).pathname) || '.jpg';
            const filename = `${id}${extension}`;
            const filepath = path.join(categoryDir, filename);

            try {
                console.log(`Downloading ${id}...`);
                await this.downloadImage(url, filepath);
                console.log(`✓ ${id} downloaded successfully`);
                this.downloaded++;
            } catch (error) {
                console.error(`✗ Failed to download ${id}: ${error.message}`);
                
                // Try alternative URL if available
                if (alternativeUrls[category] && alternativeUrls[category][id]) {
                    console.log(`  Trying alternative source...`);
                    try {
                        await this.downloadImage(alternativeUrls[category][id], filepath);
                        console.log(`  ✓ ${id} downloaded from alternative source`);
                        this.downloaded++;
                    } catch (altError) {
                        console.error(`  ✗ Alternative also failed: ${altError.message}`);
                        this.failed++;
                    }
                } else {
                    this.failed++;
                }
            }
        }
    }

    async downloadAll() {
        console.log('Dark Souls Wiki Image Downloader');
        console.log('================================\n');

        // Ensure base directory exists
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }

        // Download each category
        for (const [category, urls] of Object.entries(imageUrls)) {
            await this.downloadCategory(category, urls);
        }

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('Download Summary:');
        console.log(`Total: ${this.total}`);
        console.log(`Downloaded: ${this.downloaded}`);
        console.log(`Failed: ${this.failed}`);
        console.log('='.repeat(50));

        if (this.failed > 0) {
            console.log('\nNote: Some images failed to download.');
            console.log('You may need to:');
            console.log('1. Check your internet connection');
            console.log('2. Update the URLs in the script');
            console.log('3. Download failed images manually');
        }
    }
}

// Run the downloader
if (require.main === module) {
    const downloader = new ImageDownloader();
    downloader.downloadAll().catch(console.error);
}

module.exports = ImageDownloader;