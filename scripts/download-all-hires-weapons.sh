#!/bin/bash

# Comprehensive high-resolution weapon image downloader
# Target: Minimum 50KB per image for good quality

BASE_DIR="assets/images/weapons"
mkdir -p "$BASE_DIR"

# Function to download and verify quality
download_hq() {
    local name=$1
    local url=$2
    local min_size=${3:-50000}  # Default 50KB minimum
    local output="$BASE_DIR/${name}.png"
    
    echo -n "Downloading $name... "
    
    # Download with all necessary headers
    if curl -L -o "$output" \
        -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" \
        -H "Accept: image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" \
        -H "Accept-Language: en-US,en;q=0.9" \
        -H "Cache-Control: no-cache" \
        -H "Pragma: no-cache" \
        --connect-timeout 30 \
        --max-time 60 \
        "$url" 2>/dev/null; then
        
        # Check file validity and size
        if [ -f "$output" ] && file "$output" | grep -E "(PNG|JPEG)" >/dev/null; then
            local size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
            if [ "$size" -ge "$min_size" ]; then
                echo "✓ Success! ($(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size}B"))"
                return 0
            else
                echo "✗ Too small (${size}B < ${min_size}B)"
                rm -f "$output"
            fi
        else
            echo "✗ Invalid file"
            rm -f "$output"
        fi
    else
        echo "✗ Download failed"
    fi
    
    return 1
}

echo "🎮 Dark Souls Wiki - High Resolution Weapon Image Downloader"
echo "==========================================================="
echo "Target: 50KB+ images for optimal quality"
echo

# High-resolution image URLs from various sources
# These are direct links to larger images

echo "📥 Downloading Dark Souls 1 weapons..."
download_hq "zweihander" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/zweihander-onhand-large-full.jpg" 40000
download_hq "claymore" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/claymore-onhand-large-full.jpg" 40000
download_hq "uchigatana" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/uchigatana-onhand-large-full.jpg" 40000
download_hq "black-knight-sword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword-onhand-large-full.jpg" 40000
download_hq "moonlight-greatsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/moonlight_greatsword-onhand-large-full.jpg" 40000
download_hq "estoc" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/estoc-onhand-large-full.jpg" 40000
download_hq "longsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/longsword-onhand-large-full.jpg" 40000
download_hq "dark-hand" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/dark_hand-onhand-large-full.jpg" 40000

echo
echo "📥 Downloading Dark Souls 3 weapons..."
download_hq "dragonslayer-greataxe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dragonslayer_greataxe-onhand-large-full.jpg" 40000
download_hq "farron-greatsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/farron_greatsword-onhand-large-full.jpg" 40000
download_hq "frayed-blade" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/frayed_blade-onhand-large-full.jpg" 40000
download_hq "friede-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/friede's_great_scythe-onhand-large-full.jpg" 40000
download_hq "gael-greatsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/gael's_greatsword-onhand-large-full.jpg" 40000
download_hq "lothric-knight-straight-sword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/lothric_knight_sword-onhand-large-full.jpg" 40000
download_hq "murky-hand-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/murky_hand_scythe-onhand-large-full.jpg" 40000
download_hq "ringed-knight-paired-greatswords" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ringed_knight_paired_greatswords-onhand-large-full.jpg" 40000
download_hq "sellsword-twinblades" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sellsword_twinblades-onhand-large-full.jpg" 40000
download_hq "splitleaf-greatsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/splitleaf_greatsword-onhand-large-full.jpg" 40000

# Try alternative high-res sources
echo
echo "📥 Trying alternative sources for missing weapons..."

# Wikidot high-res images
download_hq "zweihander" "http://darksouls.wikidot.com/local--files/zweihander/zweihander-onhand-large.jpg" 40000
download_hq "claymore" "http://darksouls.wikidot.com/local--files/claymore/claymore-onhand-large.jpg" 40000
download_hq "estoc" "http://darksouls.wikidot.com/local--files/estoc/estoc-onhand-large.jpg" 40000

# Direct game asset URLs (if available)
download_hq "black-knight-sword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword_large.jpg" 30000
download_hq "longsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/longsword-thumb-large.jpg" 30000

# Try render images
echo
echo "📥 Trying render/concept art for maximum quality..."
download_hq "moonlight-greatsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/moonlight_greatsword_render.jpg" 50000
download_hq "frayed-blade" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/frayed_blade_concept.jpg" 50000

echo
echo "📊 Download Summary:"
echo "==================="
echo "Total PNG images: $(find $BASE_DIR -name "*.png" | wc -l | tr -d ' ')"
echo "High quality (>50KB): $(find $BASE_DIR -name "*.png" -size +50k | wc -l | tr -d ' ')"
echo "Medium quality (20-50KB): $(find $BASE_DIR -name "*.png" -size +20k -size -50k | wc -l | tr -d ' ')"
echo "Low quality (<20KB): $(find $BASE_DIR -name "*.png" -size -20k | wc -l | tr -d ' ')"
echo
echo "Detailed breakdown:"
find $BASE_DIR -name "*.png" -exec ls -lh {} \; | awk '{print $5 " " $9}' | sort -k1 -h