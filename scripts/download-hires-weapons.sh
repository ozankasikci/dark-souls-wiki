#!/bin/bash

# Download high-resolution weapon images from multiple sources
# Target: 400x400px minimum

BASE_DIR="assets/images/weapons"

# Function to download and verify high-res images
download_hires() {
    local name=$1
    local output="$BASE_DIR/${name}.png"
    shift
    local urls=("$@")
    
    echo "🔍 Searching high-res image for $name..."
    
    for url in "${urls[@]}"; do
        local temp="/tmp/${name}_temp.png"
        echo -n "  Trying $(echo $url | cut -d'/' -f3)... "
        
        if curl -L -s -o "$temp" \
            -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
            -H "Accept: image/webp,image/apng,image/*,*/*;q=0.8" \
            -H "Referer: https://darksouls.wiki.fextralife.com/" \
            --connect-timeout 15 \
            --max-time 30 \
            "$url" 2>/dev/null; then
            
            # Check if it's a valid image
            if [ -s "$temp" ] && file "$temp" | grep -E "(PNG|JPEG|image)" >/dev/null; then
                # Get image dimensions if possible
                dimensions=$(file "$temp" | grep -oE '[0-9]+ x [0-9]+' || echo "unknown")
                size=$(stat -f%z "$temp" 2>/dev/null || stat -c%s "$temp" 2>/dev/null)
                
                # Accept if larger than 10KB (likely higher res)
                if [ "$size" -gt 10000 ]; then
                    mv "$temp" "$output"
                    echo "✓ Success! ($dimensions, $(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size}B"))"
                    return 0
                else
                    echo "✗ Too small ($size bytes)"
                fi
            else
                echo "✗ Invalid"
            fi
            rm -f "$temp"
        else
            echo "✗ Failed"
        fi
    done
    
    echo "  ⚠️  No high-res version found for $name"
    return 1
}

echo "🎮 Dark Souls High-Resolution Weapon Image Downloader"
echo "===================================================="
echo

# Remove old low-quality images first
echo "🗑️  Removing low-quality images..."
find "$BASE_DIR" -name "*.png" -size -5k -exec rm {} \; -exec echo "  Removed: {}" \;
echo

# Download high-res versions
echo "📥 Downloading high-resolution weapon images..."
echo

# Zweihander
download_hires "zweihander" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/zweihander-onhand-large.jpg" \
    "https://darksouls.fandom.com/wiki/Zweihander_(Dark_Souls)?file=Zweihander.png" \
    "https://static.wikia.nocookie.net/darksouls/images/b/b8/Zweihander.png/revision/latest?cb=20130212005528" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/zweihander-onhand.jpg"

# Claymore (currently 80x90 - needs replacement)
download_hires "claymore" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/claymore-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/7/77/Claymore.png/revision/latest?cb=20130212003712" \
    "https://darksouls.fandom.com/wiki/Claymore?file=Claymore.png" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/claymore_lg.png"

# Black Knight Sword
download_hires "black-knight-sword" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/9/90/Black_knight_sword.png/revision/latest?cb=20130212003136" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword_lg.png"

# Uchigatana
download_hires "uchigatana" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/uchigatana-onhand-large.jpg" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/uchigatana-onhand.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/f/ff/Uchigatana_%28DSIII%29.png/revision/latest?cb=20160612045037"

# Estoc
download_hires "estoc" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/estoc-onhand-large.jpg" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/estoc-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/9/93/Estoc.png/revision/latest?cb=20130814205045"

# Moonlight Greatsword
download_hires "moonlight-greatsword" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/moonlight_greatsword-onhand-large.jpg" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/moonlight_greatsword_lg.png" \
    "https://static.wikia.nocookie.net/darksouls/images/8/87/Moonlight_Greatsword_%28DSIII%29.png/revision/latest?cb=20160514131526"

# Longsword
download_hires "longsword" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/longsword-onhand-large.jpg" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/longsword-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/c/c5/Longsword.png/revision/latest?cb=20130212003926"

# Dark Hand
download_hires "dark-hand" \
    "https://darksouls.wiki.fextralife.com/file/Dark-Souls/dark_hand-onhand-large.jpg" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dark_hand.png" \
    "https://static.wikia.nocookie.net/darksouls/images/6/69/Dark_Hand.png/revision/latest?cb=20130813233111"

# Farron Greatsword
download_hires "farron-greatsword" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/farron_greatsword-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/5/56/Farron_Greatsword.png/revision/latest?cb=20160514125636"

# Sellsword Twinblades
download_hires "sellsword-twinblades" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sellsword_twinblades-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/4/41/Sellsword_Twinblades.png/revision/latest?cb=20160514132656"

# Lothric Knight Straight Sword
download_hires "lothric-knight-straight-sword" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/lothric_knight_sword-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/8/82/Lothric_Knight_Sword.png/revision/latest?cb=20160612044621"

# Dragonslayer Greataxe
download_hires "dragonslayer-greataxe" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dragonslayer_greataxe_lg.png" \
    "https://static.wikia.nocookie.net/darksouls/images/a/a1/Dragonslayer_Greataxe.png/revision/latest?cb=20160612050741"

# Gael's Greatsword
download_hires "gael-greatsword" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/gael's_greatsword-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/c/c3/Gael%27s_Greatsword.png/revision/latest?cb=20170405102301"

# Frayed Blade
download_hires "frayed-blade" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/frayed_blade-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/d/d7/Frayed_Blade.png/revision/latest?cb=20170329135322"

# Friede's Scythe
download_hires "friede-scythe" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/friede's_great_scythe-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/1/15/Friede%27s_Great_Scythe.png/revision/latest?cb=20161025214409"

# Murky Hand Scythe
download_hires "murky-hand-scythe" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/murky_hand_scythe_onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/5/5f/Murky_Hand_Scythe.png/revision/latest?cb=20170405104511"

# Ringed Knight Paired Greatswords
download_hires "ringed-knight-paired-greatswords" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ringed_knight_paired_greatswords-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/9/96/Ringed_Knight_Paired_Greatswords.png/revision/latest?cb=20170404115041"

# Splitleaf Greatsword
download_hires "splitleaf-greatsword" \
    "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/splitleaf_greatsword-onhand-large.jpg" \
    "https://static.wikia.nocookie.net/darksouls/images/e/e7/Splitleaf_Greatsword.png/revision/latest?cb=20170405112316"

echo
echo "📊 Final Statistics:"
echo "==================="
echo "Total weapon images: $(find $BASE_DIR -name "*.png" -o -name "*.jpg" | wc -l | tr -d ' ')"
echo "High-res images (>10KB): $(find $BASE_DIR \( -name "*.png" -o -name "*.jpg" \) -size +10k | wc -l | tr -d ' ')"
echo "Low-res images (<10KB): $(find $BASE_DIR \( -name "*.png" -o -name "*.jpg" \) -size -10k | wc -l | tr -d ' ')"
echo
echo "✨ Download complete!"