#!/usr/bin/env python3
"""
Image Downloader for Dark Souls Wiki
Python version for downloading images from various sources
"""

import os
import sys
import json
import requests
from urllib.parse import urlparse
from pathlib import Path
import time

# Configuration
BASE_DIR = Path(__file__).parent.parent / 'assets' / 'images'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

# Image URLs - Using direct URLs from various sources
IMAGE_URLS = {
    'weapons': {
        'zweihander': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/zweihander.png',
            'http://darksouls.wikidot.com/local--files/ultra-greatswords/zweihander.png'
        ],
        'claymore': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/claymore.png',
            'http://darksouls.wikidot.com/local--files/greatswords/claymore.png'
        ],
        'uchigatana': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/uchigatana-lg.png',
            'http://darksouls.wikidot.com/local--files/katanas/uchigatana.png'
        ],
        'black-knight-sword': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword.png'
        ],
        'moonlight-greatsword': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/moonlight_greatsword.png'
        ],
        'estoc': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/estoc.png'
        ],
        'longsword': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/longsword.png'
        ],
        'dark-hand': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/dark_hand.png'
        ]
    },
    'bosses': {
        'asylum-demon': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/asylum_demon.jpg'
        ],
        'bell-gargoyles': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/bell_gargoyle.jpg'
        ],
        'taurus-demon': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/taurus_demon.jpg'
        ]
    },
    'areas': {
        'firelink-shrine': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/firelink_shrine.jpg'
        ],
        'undead-burg': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/undead_burg.jpg'
        ],
        'anor-londo': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/anor_londo.jpg'
        ],
        'blighttown': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/blighttown.jpg'
        ]
    },
    'npcs': {
        'solaire': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/solaire_of_astora.jpg'
        ],
        'siegmeyer': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/siegmeyer_of_catarina.jpg'
        ],
        'andre': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/andre_of_astora.jpg'
        ]
    },
    'items': {
        'estus-flask': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/estus_flask.png'
        ],
        'ring-of-favor': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/ring_of_favor_and_protection.png'
        ]
    }
}

class ImageDownloader:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.downloaded = 0
        self.failed = 0
        self.total = 0
        
    def download_image(self, url, filepath):
        """Download a single image from URL to filepath"""
        try:
            response = self.session.get(url, timeout=30, stream=True)
            response.raise_for_status()
            
            # Write image to file
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"  Error: {str(e)}")
            return False
    
    def get_extension(self, url):
        """Get file extension from URL"""
        parsed = urlparse(url)
        ext = os.path.splitext(parsed.path)[1]
        return ext if ext else '.jpg'
    
    def download_category(self, category, items):
        """Download all images in a category"""
        category_dir = BASE_DIR / category
        category_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\nDownloading {category}...")
        print("-" * 50)
        
        for item_id, urls in items.items():
            self.total += 1
            success = False
            
            # Try each URL until one succeeds
            for i, url in enumerate(urls):
                ext = self.get_extension(url)
                filename = f"{item_id}{ext}"
                filepath = category_dir / filename
                
                print(f"Downloading {item_id}...", end='')
                
                if self.download_image(url, filepath):
                    print(f" ✓ Success")
                    self.downloaded += 1
                    success = True
                    break
                else:
                    if i < len(urls) - 1:
                        print(f"\n  Trying alternative source {i+2}...", end='')
                    else:
                        print(f" ✗ Failed")
            
            if not success:
                self.failed += 1
            
            # Small delay to be polite to servers
            time.sleep(0.5)
    
    def download_all(self):
        """Download all images"""
        print("Dark Souls Wiki Image Downloader (Python)")
        print("=" * 50)
        
        # Download each category
        for category, items in IMAGE_URLS.items():
            self.download_category(category, items)
        
        # Summary
        print("\n" + "=" * 50)
        print("Download Summary:")
        print(f"Total: {self.total}")
        print(f"Downloaded: {self.downloaded}")
        print(f"Failed: {self.failed}")
        print("=" * 50)
        
        if self.failed > 0:
            print("\nNote: Some images failed to download.")
            print("You may need to:")
            print("1. Check your internet connection")
            print("2. Try running the script again")
            print("3. Download failed images manually")
    
    def generate_url_list(self):
        """Generate a JSON file with all image URLs for reference"""
        output_file = BASE_DIR.parent.parent / 'docs' / 'image-urls.json'
        
        with open(output_file, 'w') as f:
            json.dump(IMAGE_URLS, f, indent=2)
        
        print(f"\nImage URL list saved to: {output_file}")

def main():
    """Main function"""
    downloader = ImageDownloader()
    
    if len(sys.argv) > 1 and sys.argv[1] == '--urls':
        downloader.generate_url_list()
    else:
        try:
            downloader.download_all()
        except KeyboardInterrupt:
            print("\n\nDownload interrupted by user")
        except Exception as e:
            print(f"\n\nError: {str(e)}")

if __name__ == "__main__":
    main()