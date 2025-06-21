#!/bin/bash

BASE_DIR="assets/images/weapons"
mkdir -p "$BASE_DIR"

# Function to download with quality check
download_weapon() {
    local name=$1
    local clean_name=$2
    local output="$BASE_DIR/${name}.png"
    local current_size=0
    
    # Check current file size if exists
    if [ -f "$output" ]; then
        current_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
    fi
    
    echo -n "$name: "
    
    # Try multiple URL patterns
    local urls=(
        # Dark Souls 3 - highest quality first
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${clean_name}-icon.png"
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${clean_name}_icon.png"
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${clean_name}.png"
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${clean_name}_lg.png"
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${clean_name}-lg.png"
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${clean_name}_large.png"
        
        # Dark Souls 1 alternatives
        "https://darksouls.wiki.fextralife.com/file/Dark-Souls/${clean_name}.png"
        "https://darksouls.wiki.fextralife.com/file/Dark-Souls/${clean_name}_icon.png"
        "https://darksouls.wiki.fextralife.com/file/Dark-Souls/${clean_name}-icon.png"
        
        # Try inventory icons (usually higher res)
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/inventory_${clean_name}.png"
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${clean_name}_inventory.png"
    )
    
    local best_url=""
    local best_size=0
    local temp="/tmp/weapon_temp_$$"
    
    # Try each URL and keep the largest
    for url in "${urls[@]}"; do
        if curl -L -s -o "$temp" \
            -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
            -H "Accept: image/*" \
            --max-time 10 \
            "$url" 2>/dev/null; then
            
            if file "$temp" | grep -E "image|PNG|JPEG" >/dev/null && [ -s "$temp" ]; then
                local size=$(stat -f%z "$temp" 2>/dev/null || stat -c%s "$temp" 2>/dev/null)
                if [ "$size" -gt "$best_size" ]; then
                    best_size=$size
                    best_url=$url
                    cp "$temp" "${temp}_best"
                fi
            fi
        fi
    done
    
    rm -f "$temp"
    
    # Use the best one if it's better than current
    if [ "$best_size" -gt "$current_size" ] && [ "$best_size" -gt 2000 ]; then
        mv "${temp}_best" "$output"
        echo "✓ Updated (${best_size} bytes, was ${current_size})"
    else
        rm -f "${temp}_best"
        if [ "$current_size" -gt 0 ]; then
            echo "✓ Kept existing (${current_size} bytes)"
        else
            echo "✗ No good image found"
        fi
    fi
}

echo "🗡️ Comprehensive Dark Souls Weapon Image Downloader"
echo "=================================================="
echo "Finding highest resolution version for each weapon..."
echo

# All weapons from the data
weapons=(
    "zweihander:zweihander"
    "claymore:claymore"
    "black-knight-sword:black_knight_sword"
    "longsword:longsword"
    "uchigatana:uchigatana"
    "moonlight-greatsword:moonlight_greatsword"
    "estoc:estoc"
    "dark-hand:dark_hand"
    "dragonslayer-greataxe:dragonslayer_greataxe"
    "farron-greatsword:farron_greatsword"
    "frayed-blade:frayed_blade"
    "friede-scythe:friede's_great_scythe"
    "gael-greatsword:gael's_greatsword"
    "lothric-knight-straight-sword:lothric_knight_sword"
    "murky-hand-scythe:murky_hand_scythe"
    "ringed-knight-paired-greatswords:ringed_knight_paired_greatswords"
    "sellsword-twinblades:sellsword_twinblades"
    "splitleaf-greatsword:splitleaf_greatsword"
)

# Download each weapon
for weapon_pair in "${weapons[@]}"; do
    IFS=':' read -r name clean_name <<< "$weapon_pair"
    download_weapon "$name" "$clean_name"
done

# Try some alternative names for problematic ones
echo
echo "Trying alternative names for low-quality images..."
download_weapon "estoc" "estoc_thrusting_sword"
download_weapon "longsword" "long_sword"
download_weapon "dark-hand" "darkhand"
download_weapon "murky-hand-scythe" "murky_handscythe"
download_weapon "murky-hand-scythe" "hand_scythe"

echo
echo "📊 Final Results:"
echo "================"
find $BASE_DIR -name "*.png" -exec ls -lh {} \; | awk '{print $5 " " $9}' | sort -k1 -hr | head -20
echo
echo "Images over 50KB: $(find $BASE_DIR -name "*.png" -size +50k | wc -l | tr -d ' ')"
echo "Images 20-50KB: $(find $BASE_DIR -name "*.png" -size +20k -size -50k | wc -l | tr -d ' ')"
echo "Images under 20KB: $(find $BASE_DIR -name "*.png" -size -20k | wc -l | tr -d ' ')"