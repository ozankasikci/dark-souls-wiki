#!/bin/bash

BASE_DIR="assets/images/weapons"

download_weapon() {
    local name=$1
    local filename=$2
    local output="$BASE_DIR/${name}.png"
    
    # Skip if already high-res
    if [ -f "$output" ]; then
        size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        if [ "$size" -gt 10000 ]; then
            echo "✓ $name already high-res (${size}B)"
            return 0
        fi
    fi
    
    echo -n "Downloading $name... "
    
    # Dark Souls 3 wiki URL pattern
    local url="https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${filename}.png"
    
    if curl -L -s -o "$output" \
        -H "User-Agent: Mozilla/5.0" \
        "$url" 2>/dev/null; then
        
        size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        if [ "$size" -gt 5000 ]; then
            echo "✓ Success! (${size}B)"
            return 0
        else
            rm -f "$output"
        fi
    fi
    
    # Try DS1 pattern
    url="https://darksouls.wiki.fextralife.com/file/Dark-Souls/${filename}.png"
    if curl -L -s -o "$output" \
        -H "User-Agent: Mozilla/5.0" \
        "$url" 2>/dev/null; then
        
        size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        if [ "$size" -gt 5000 ]; then
            echo "✓ Success! (${size}B)"
            return 0
        else
            rm -f "$output"
        fi
    fi
    
    echo "✗ Failed"
    return 1
}

echo "🗡️ Downloading more high-res weapon images..."
echo "==========================================="
echo

# DS3 weapons (different filename patterns)
download_weapon "estoc" "estoc-icon"
download_weapon "estoc" "estoc_sword"
download_weapon "estoc" "Estoc"

download_weapon "uchigatana" "uchigatana"
download_weapon "uchigatana" "uchigatana-katana"
download_weapon "uchigatana" "Uchigatana"

download_weapon "moonlight-greatsword" "moonlight_greatsword"
download_weapon "moonlight-greatsword" "moonlight-greatsword"
download_weapon "moonlight-greatsword" "Moonlight_Greatsword"

# Try without hyphens
download_weapon "dark-hand" "darkhand"
download_weapon "farron-greatsword" "farron_greatsword"
download_weapon "frayed-blade" "frayed_blade" 
download_weapon "gael-greatsword" "gaels_greatsword"
download_weapon "lothric-knight-straight-sword" "lothric_knight_sword"
download_weapon "murky-hand-scythe" "murky_hand_scythe"
download_weapon "ringed-knight-paired-greatswords" "ringed_knight_paired_greatswords"
download_weapon "sellsword-twinblades" "sellsword_twinblades"
download_weapon "splitleaf-greatsword" "splitleaf_greatsword"

echo
echo "📊 Final count: $(find $BASE_DIR -name "*.png" | wc -l | tr -d ' ') weapon images"