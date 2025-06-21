#!/bin/bash

BASE_DIR="assets/images/weapons"
mkdir -p "$BASE_DIR"

# Function to download only if better than existing
download_if_better() {
    local name=$1
    local url=$2
    local output="$BASE_DIR/${name}.png"
    local current_size=0
    
    # Get current size
    if [ -f "$output" ]; then
        current_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
    fi
    
    # Skip if already good quality (>30KB)
    if [ "$current_size" -gt 30000 ]; then
        echo "$name: Already high quality (${current_size} bytes)"
        return
    fi
    
    echo -n "$name: "
    
    # Download to temp
    local temp="/tmp/${name}_dl"
    if curl -L -s -o "$temp" \
        -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
        -H "Accept: image/*" \
        -H "Referer: https://darksouls3.wiki.fextralife.com/" \
        --max-time 20 \
        "$url" 2>/dev/null; then
        
        if file "$temp" | grep -E "image|PNG|JPEG" >/dev/null && [ -s "$temp" ]; then
            local new_size=$(stat -f%z "$temp" 2>/dev/null || stat -c%s "$temp" 2>/dev/null)
            if [ "$new_size" -gt "$current_size" ] && [ "$new_size" -gt 10000 ]; then
                mv "$temp" "$output"
                echo "✓ Updated (${current_size} → ${new_size} bytes)"
            else
                rm -f "$temp"
                echo "✗ Not better (${new_size} vs ${current_size})"
            fi
        else
            rm -f "$temp"
            echo "✗ Invalid file"
        fi
    else
        echo "✗ Download failed"
    fi
}

echo "🗡️ Final High-Resolution Weapon Image Pass"
echo "=========================================="
echo "Targeting low-quality images (<30KB)..."
echo

# Focus on the weapons with poorest quality
echo "Attempting alternative URLs for small images:"

# Estoc variants
download_if_better "estoc" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/estoc_profiled_large.jpg"
download_if_better "estoc" "https://darksouls3.wikidot.com/local--files/equipmentgroup:estoc/Estoc.png"
download_if_better "estoc" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/estoc.jpg"

# Longsword variants
download_if_better "longsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/longsword_profiled_large.jpg"
download_if_better "longsword" "https://darksouls3.wikidot.com/local--files/equipmentgroup:longsword/Longsword.png"
download_if_better "longsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/longsword.jpg"

# Dark Hand variants
download_if_better "dark-hand" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dark_hand_profiled_large.jpg"
download_if_better "dark-hand" "https://darksouls3.wikidot.com/local--files/equipmentgroup:dark-hand/Dark_Hand.png"

# Murky Hand Scythe variants
download_if_better "murky-hand-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/murky_hand_scythe_profiled_large.jpg"
download_if_better "murky-hand-scythe" "https://darksouls3.wikidot.com/local--files/equipmentgroup:murky-hand-scythe/Murky_Hand_Scythe.png"

# Zweihander variants
download_if_better "zweihander" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/zweihander_profiled_large.jpg"
download_if_better "zweihander" "https://darksouls.wikidot.com/local--files/equipmentgroup:zweihander/Zweihander.png"

# Claymore variants
download_if_better "claymore" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/claymore_profiled_large.jpg"
download_if_better "claymore" "https://darksouls.wikidot.com/local--files/equipmentgroup:claymore/Claymore.png"

# Ringed Knight Paired Greatswords
download_if_better "ringed-knight-paired-greatswords" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ringed_knight_paired_greatswords_profiled_large.jpg"

# Lothric Knight Straight Sword
download_if_better "lothric-knight-straight-sword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/lothric_knight_sword_profiled_large.jpg"

# Black Knight Sword
download_if_better "black-knight-sword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/black_knight_sword_profiled_large.jpg"

# Moonlight Greatsword
download_if_better "moonlight-greatsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/moonlight_greatsword_profiled_large.jpg"

# Try community wikis
echo
echo "Trying community wiki sources:"
download_if_better "friede-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/friede's_great_scythe.png"
download_if_better "friede-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sister_friede's_scythe.png"

echo
echo "📊 Final Quality Report:"
echo "======================="
echo "Excellent (>50KB): $(find $BASE_DIR -name "*.png" -size +50k | wc -l | tr -d ' ')"
echo "Good (30-50KB): $(find $BASE_DIR -name "*.png" -size +30k -size -50k | wc -l | tr -d ' ')"
echo "Acceptable (15-30KB): $(find $BASE_DIR -name "*.png" -size +15k -size -30k | wc -l | tr -d ' ')"
echo "Poor (<15KB): $(find $BASE_DIR -name "*.png" -size -15k | wc -l | tr -d ' ')"
echo
echo "Detailed list of all weapons:"
find $BASE_DIR -name "*.png" -exec ls -lh {} \; | awk '{print $5 " " $9}' | sort -k1 -hr