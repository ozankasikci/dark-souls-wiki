#!/bin/bash

# High-quality weapon image downloader
# Downloads from multiple sources for better quality

BASE_DIR="assets/images/weapons"

# Function to download image with quality check
download_hq_image() {
    local name=$1
    local url=$2
    local filepath="$BASE_DIR/${name}.png"
    
    # Check if file exists and is a valid image with good size
    if [ -f "$filepath" ]; then
        if file "$filepath" | grep -q "image" && [ $(stat -f%z "$filepath" 2>/dev/null || stat -c%s "$filepath" 2>/dev/null) -gt 1000 ]; then
            echo "✓ Already have $name"
            return 0
        else
            # Remove invalid file
            rm -f "$filepath"
        fi
    fi
    
    echo -n "Downloading $name... "
    
    # Download with better headers
    if curl -L -s -o "$filepath" \
        -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
        -H "Accept: image/webp,image/apng,image/*,*/*;q=0.8" \
        -H "Accept-Language: en-US,en;q=0.9" \
        -H "Referer: https://darksouls.wiki.fextralife.com/" \
        --connect-timeout 10 \
        --max-time 30 \
        "$url"; then
        
        # Verify it's an image and has reasonable size
        if [ -s "$filepath" ] && file "$filepath" | grep -q "image"; then
            size=$(stat -f%z "$filepath" 2>/dev/null || stat -c%s "$filepath" 2>/dev/null)
            if [ "$size" -gt 1000 ]; then
                echo "✓ ($(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size}B"))"
                return 0
            else
                echo "✗ (too small)"
                rm -f "$filepath"
                return 1
            fi
        else
            echo "✗ (not an image)"
            rm -f "$filepath"
            return 1
        fi
    else
        echo "✗ (download failed)"
        rm -f "$filepath"
        return 1
    fi
}

echo "Dark Souls Wiki - High Quality Weapon Image Downloader"
echo "====================================================="

# Try multiple URL patterns for each weapon
echo -e "\nDownloading missing weapon images..."

# Black Knight Sword - try different URLs
download_hq_image "black-knight-sword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_Black_Knight_Sword.png" || \
download_hq_image "black-knight-sword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword_lg.png" || \
download_hq_image "black-knight-sword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Black_Knight_Sword.png"

# Estoc
download_hq_image "estoc" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_Estoc.png" || \
download_hq_image "estoc" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/estoc-lg.png" || \
download_hq_image "estoc" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Estoc.png"

# Longsword
download_hq_image "longsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_Longsword.png" || \
download_hq_image "longsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/longsword-lg.png" || \
download_hq_image "longsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Longsword.png"

# Moonlight Greatsword
download_hq_image "moonlight-greatsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_Moonlight_Greatsword.png" || \
download_hq_image "moonlight-greatsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/moonlight_greatsword_lg.png" || \
download_hq_image "moonlight-greatsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Moonlight_Greatsword.png"

# Uchigatana
download_hq_image "uchigatana" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_Uchigatana.png" || \
download_hq_image "uchigatana" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/uchigatana_lg.png" || \
download_hq_image "uchigatana" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Uchigatana.png"

# Friede's Scythe (DS3)
download_hq_image "friede-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/friede's_great_scythe.png" || \
download_hq_image "friede-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/friedes_great_scythe.png" || \
download_hq_image "friede-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/Friede_Great_Scythe.png"

# Check final status
echo -e "\n✨ Download complete!"
echo "Total weapon images: $(find $BASE_DIR -name "*.png" -type f | wc -l | tr -d ' ')"