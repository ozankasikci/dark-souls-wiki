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
        ],
        'dragonslayer-greataxe': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dragonslayer_greataxe.png'
        ],
        'farron-greatsword': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/farron_greatsword.png'
        ],
        'frayed-blade': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/frayed_blade.png'
        ],
        'friede-scythe': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/friede%27s_great_scythe.png'
        ],
        'gael-greatsword': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/gael%27s_greatsword.png'
        ],
        'lothric-knight-straight-sword': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/lothric_knight_sword.png'
        ],
        'murky-hand-scythe': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/murky_hand_scythe.png'
        ],
        'ringed-knight-paired-greatswords': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ringed_knight_paired_greatswords.png'
        ],
        'sellsword-twinblades': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sellsword_twinblades.png'
        ],
        'splitleaf-greatsword': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/splitleaf_greatsword.png'
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
        ],
        'vordt': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/vordt_of_the_boreal_valley.jpg'
        ],
        'crystal-sage': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/crystal_sage.jpg'
        ],
        'abyss-watchers': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/abyss_watchers_small.jpg'
        ],
        'iudex-gundyr': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/iudex_gundyr_small.jpg'
        ],
        'curse-rotted-greatwood': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/curse-rotted_greatwood.jpg'
        ],
        'aldrich-devourer-of-gods': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/aldrich_devourer_of_gods_small.jpg'
        ],
        'champion-gundyr': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/champion_gundyr.jpg'
        ],
        'dancer-of-the-boreal-valley': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dancer_of_the_boreal_valley.jpg'
        ],
        'darkeater-midir': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/darkeater_midir_small.jpg'
        ],
        'demon-prince': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/demon_prince.jpg'
        ],
        'lothric-younger-prince': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/lothric_younger_prince_small.jpg'
        ],
        'nameless-king': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/nameless_king_small.jpg'
        ],
        'pontiff-sulyvahn': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/pontiff_sulyvahn.jpg'
        ],
        'sister-friede': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sister_friede.jpg'
        ],
        'slave-knight-gael': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/slave_knight_gael_small.jpg'
        ],
        'soul-of-cinder': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/soul_of_cinder_small.jpg'
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
        ],
        'northern-undead-asylum': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/undead_asylum.jpg'
        ],
        'undead-parish': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/undead_parish.jpg'
        ],
        'depths': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/the_depths.jpg'
        ],
        'valley-of-drakes': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/valley_of_drakes.jpg'
        ],
        'darkroot-garden': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/darkroot_garden.jpg'
        ],
        'darkroot-basin': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/darkroot_basin.jpg'
        ],
        'new-londo-ruins': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/new_londo_ruins.jpg'
        ],
        'sens-fortress': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/sens_fortress.jpg'
        ],
        'dukes-archives': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/the_dukes_archives.jpg'
        ],
        'crystal-cave': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/crystal_cave.jpg'
        ]
    },
    'npcs': {
        'solaire': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/solaire_of_astora.jpg'
        ],
        'solaire-of-astora': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/solaire_of_astora.jpg'
        ],
        'siegmeyer': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/siegmeyer_of_catarina.jpg'
        ],
        'siegmeyer-of-catarina': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/siegmeyer_of_catarina.jpg'
        ],
        'andre': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/andre_of_astora.jpg'
        ],
        'patches': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/patches_the_hyena.jpg'
        ],
        'patches-ds1': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/patches_the_hyena.jpg'
        ],
        'oscar-of-astora': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/oscar_of_astora.jpg'
        ],
        'fire-keeper': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/fire_keeper.jpg'
        ],
        'hawkwood': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/hawkwood_the_deserter.jpg'
        ],
        'ludleth': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ludleth_of_courland.jpg'
        ]
    },
    'items': {
        'estus-flask': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/estus_flask.png'
        ],
        'ring-of-favor': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/ring_of_favor_and_protection.png'
        ],
        'elite-knight-set': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/elite_knight_set.jpg'
        ],
        'ashen-estus-flask': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ashen_estus_flask.png'
        ],
        'coiled-sword': [
            'https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/coiled_sword.png'
        ],
        'fire-keeper-soul': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/fire_keeper_soul.png'
        ]
    },
    'armor': {
        'elite-knight-set': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/elite_knight_set.jpg'
        ]
    },
    'shields': {
        'grass-crest-shield': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/grass_crest_shield.png'
        ]
    },
    'rings': {
        'ring-of-favor': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/ring_of_favor_and_protection.png'
        ]
    },
    'catalysts': {
        'pyromancy-flame': [
            'https://darksouls.wiki.fextralife.com/file/Dark-Souls/pyromancy_flame.png'
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