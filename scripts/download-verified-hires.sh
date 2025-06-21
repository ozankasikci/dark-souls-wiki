#!/bin/bash

BASE_DIR="assets/images/weapons"
mkdir -p "$BASE_DIR"

# Function to download with size check
get_image() {
    local name=$1
    local url=$2
    local output="$BASE_DIR/${name}.png"
    
    echo -n "$name: "
    
    # First try to download to temp
    local temp="/tmp/${name}_temp"
    if curl -L -s -o "$temp" \
        -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
        -H "Accept: image/*" \
        --max-time 30 \
        "$url" 2>/dev/null; then
        
        # Check if it's an image
        if file "$temp" | grep -E "image|PNG|JPEG" >/dev/null && [ -s "$temp" ]; then
            local size=$(stat -f%z "$temp" 2>/dev/null || stat -c%s "$temp" 2>/dev/null)
            mv "$temp" "$output"
            echo "✓ ${size} bytes"
            return 0
        else
            rm -f "$temp"
            echo "✗ Invalid"
        fi
    else
        echo "✗ Failed"
    fi
    return 1
}

echo "🗡️ Downloading verified high-resolution weapon images..."
echo "======================================================"
echo

# These URLs are verified to work
echo "Dark Souls 3 weapons (verified URLs):"
get_image "zweihander" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/zweihander.png"
get_image "claymore" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/claymore.png"
get_image "black-knight-sword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/black_knight_sword.png"
get_image "longsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/longsword.png"
get_image "uchigatana" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/uchigatana.png"
get_image "moonlight-greatsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/moonlight_greatsword.png"
get_image "estoc" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/estoc.png"
get_image "dark-hand" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dark_hand.png"
get_image "farron-greatsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/farron_greatsword.png"
get_image "frayed-blade" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/frayed_blade.png"
get_image "gael-greatsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/gael's_greatsword.png"
get_image "lothric-knight-straight-sword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/lothric_knight_sword.png"
get_image "sellsword-twinblades" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sellsword_twinblades.png"
get_image "splitleaf-greatsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/splitleaf_greatsword.png"
get_image "dragonslayer-greataxe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dragonslayer_greataxe.png"
get_image "ringed-knight-paired-greatswords" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ringed_knight_paired_greatswords.png"
get_image "friede-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/friede's_great_scythe.png"
get_image "murky-hand-scythe" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/murky_hand_scythe.png"

echo
echo "Trying larger resolution variants:"
# Try -large variants
get_image "zweihander" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/zweihander-large.png"
get_image "claymore" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/claymore-large.png"
get_image "black-knight-sword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/black_knight_sword-large.png"

# Try onhand variants (usually larger)
echo
echo "Trying 'onhand' variants (usually higher res):"
get_image "zweihander" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/zweihander-onhand.jpg"
get_image "claymore" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/claymore-onhand.jpg"
get_image "longsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/longsword-onhand.jpg"
get_image "estoc" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/estoc-onhand.jpg"

echo
echo "📊 Final Results:"
echo "================"
find $BASE_DIR -name "*.png" -o -name "*.jpg" | while read f; do
    size=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null)
    name=$(basename "$f")
    printf "%-40s %10d bytes\n" "$name" "$size"
done | sort -k2 -nr