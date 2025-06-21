#!/bin/bash

# Dark Souls Wiki Image Downloader - Bash Version
# Downloads images using curl or wget

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR="${SCRIPT_DIR}/../assets/images"

# Create directories
mkdir -p "${BASE_DIR}"/{weapons,bosses,areas,npcs,items}

# Counter variables
TOTAL=0
DOWNLOADED=0
FAILED=0

# Function to download image
download_image() {
    local url="$1"
    local output="$2"
    local item_name="$3"
    
    ((TOTAL++))
    
    echo -n "Downloading ${item_name}... "
    
    if command -v curl &> /dev/null; then
        if curl -L -s -o "$output" --fail "$url" -H "User-Agent: Mozilla/5.0"; then
            echo -e "${GREEN}✓ Success${NC}"
            ((DOWNLOADED++))
            return 0
        fi
    elif command -v wget &> /dev/null; then
        if wget -q -O "$output" "$url" --user-agent="Mozilla/5.0"; then
            echo -e "${GREEN}✓ Success${NC}"
            ((DOWNLOADED++))
            return 0
        fi
    else
        echo -e "${RED}✗ No curl or wget found${NC}"
        ((FAILED++))
        return 1
    fi
    
    echo -e "${RED}✗ Failed${NC}"
    rm -f "$output" 2>/dev/null
    ((FAILED++))
    return 1
}

# Function to get file extension from URL
get_extension() {
    local url="$1"
    local ext="${url##*.}"
    case "$ext" in
        png|jpg|jpeg|gif) echo ".$ext" ;;
        *) echo ".jpg" ;;
    esac
}

echo "Dark Souls Wiki Image Downloader (Bash)"
echo "======================================"
echo

# Weapons
echo "Downloading weapons..."
echo "--------------------"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/zweihander.png" \
    "${BASE_DIR}/weapons/zweihander.png" "Zweihander"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/claymore.png" \
    "${BASE_DIR}/weapons/claymore.png" "Claymore"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/uchigatana-lg.png" \
    "${BASE_DIR}/weapons/uchigatana.png" "Uchigatana"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword.png" \
    "${BASE_DIR}/weapons/black-knight-sword.png" "Black Knight Sword"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/moonlight_greatsword.png" \
    "${BASE_DIR}/weapons/moonlight-greatsword.png" "Moonlight Greatsword"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/estoc.png" \
    "${BASE_DIR}/weapons/estoc.png" "Estoc"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/longsword.png" \
    "${BASE_DIR}/weapons/longsword.png" "Longsword"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/dark_hand.png" \
    "${BASE_DIR}/weapons/dark-hand.png" "Dark Hand"

# Bosses
echo -e "\nDownloading bosses..."
echo "--------------------"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/asylum_demon.jpg" \
    "${BASE_DIR}/bosses/asylum-demon.jpg" "Asylum Demon"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/bell_gargoyle.jpg" \
    "${BASE_DIR}/bosses/bell-gargoyles.jpg" "Bell Gargoyles"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/taurus_demon.jpg" \
    "${BASE_DIR}/bosses/taurus-demon.jpg" "Taurus Demon"

# Areas
echo -e "\nDownloading areas..."
echo "-------------------"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/firelink_shrine.jpg" \
    "${BASE_DIR}/areas/firelink-shrine.jpg" "Firelink Shrine"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/undead_burg.jpg" \
    "${BASE_DIR}/areas/undead-burg.jpg" "Undead Burg"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/anor_londo.jpg" \
    "${BASE_DIR}/areas/anor-londo.jpg" "Anor Londo"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/blighttown.jpg" \
    "${BASE_DIR}/areas/blighttown.jpg" "Blighttown"

# NPCs
echo -e "\nDownloading NPCs..."
echo "------------------"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/solaire_of_astora.jpg" \
    "${BASE_DIR}/npcs/solaire.jpg" "Solaire"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/siegmeyer_of_catarina.jpg" \
    "${BASE_DIR}/npcs/siegmeyer.jpg" "Siegmeyer"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/andre_of_astora.jpg" \
    "${BASE_DIR}/npcs/andre.jpg" "Andre"

# Items
echo -e "\nDownloading items..."
echo "-------------------"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/estus_flask.png" \
    "${BASE_DIR}/items/estus-flask.png" "Estus Flask"

download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/ring_of_favor_and_protection.png" \
    "${BASE_DIR}/items/ring-of-favor.png" "Ring of Favor"

# Summary
echo
echo "======================================"
echo "Download Summary:"
echo "Total: ${TOTAL}"
echo -e "Downloaded: ${GREEN}${DOWNLOADED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo "======================================"

if [ $FAILED -gt 0 ]; then
    echo
    echo -e "${YELLOW}Note: Some images failed to download.${NC}"
    echo "You may need to:"
    echo "1. Check your internet connection"
    echo "2. Install curl or wget"
    echo "3. Download failed images manually"
fi