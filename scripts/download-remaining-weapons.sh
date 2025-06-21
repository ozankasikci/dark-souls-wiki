#!/bin/bash

# Download remaining weapon images from various sources

BASE_DIR="assets/images/weapons"

# Function to try downloading from multiple sources
try_download() {
    local name=$1
    shift
    local urls=("$@")
    
    for url in "${urls[@]}"; do
        echo -n "Trying $name from $(echo $url | cut -d'/' -f3)... "
        
        local temp_file="/tmp/${name}_temp.png"
        
        if curl -L -s -o "$temp_file" \
            -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
            -H "Accept: image/*" \
            --connect-timeout 10 \
            --max-time 30 \
            "$url" 2>/dev/null; then
            
            # Check if it's a valid image
            if [ -s "$temp_file" ] && file "$temp_file" | grep -E "(PNG|JPEG|image)" >/dev/null; then
                local size=$(stat -f%z "$temp_file" 2>/dev/null || stat -c%s "$temp_file" 2>/dev/null)
                if [ "$size" -gt 2000 ]; then
                    mv "$temp_file" "$BASE_DIR/${name}.png"
                    echo "✓ Success! ($(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size}B"))"
                    return 0
                else
                    echo "✗ Too small"
                fi
            else
                echo "✗ Invalid"
            fi
            rm -f "$temp_file"
        else
            echo "✗ Failed"
        fi
    done
    
    return 1
}

echo "Attempting to download remaining weapon images..."
echo "=============================================="

# Black Knight Sword - try more URLs
if [ ! -f "$BASE_DIR/black-knight-sword.png" ] || [ $(stat -f%z "$BASE_DIR/black-knight-sword.png" 2>/dev/null || echo 0) -lt 1000 ]; then
    try_download "black-knight-sword" \
        "https://darksouls.fandom.com/wiki/Black_Knight_Sword?file=Black_knight_sword.png" \
        "https://static.wikia.nocookie.net/darksouls/images/9/90/Black_knight_sword.png" \
        "https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword.png"
fi

# Estoc
if [ ! -f "$BASE_DIR/estoc.png" ] || [ $(stat -f%z "$BASE_DIR/estoc.png" 2>/dev/null || echo 0) -lt 1000 ]; then
    try_download "estoc" \
        "https://darksouls.fandom.com/wiki/Estoc?file=Estoc.png" \
        "https://static.wikia.nocookie.net/darksouls/images/e/e9/Estoc.png" \
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/estoc.png"
fi

# Moonlight Greatsword
if [ ! -f "$BASE_DIR/moonlight-greatsword.png" ] || [ $(stat -f%z "$BASE_DIR/moonlight-greatsword.png" 2>/dev/null || echo 0) -lt 1000 ]; then
    try_download "moonlight-greatsword" \
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/moonlight_greatsword.png" \
        "https://static.wikia.nocookie.net/darksouls/images/a/a0/Moonlight_Greatsword.png" \
        "https://darksouls.fandom.com/wiki/Moonlight_Greatsword?file=Moonlight_greatsword.png"
fi

# Uchigatana
if [ ! -f "$BASE_DIR/uchigatana.png" ] || [ $(stat -f%z "$BASE_DIR/uchigatana.png" 2>/dev/null || echo 0) -lt 1000 ]; then
    try_download "uchigatana" \
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/uchigatana-icon.png" \
        "https://static.wikia.nocookie.net/darksouls/images/5/54/Uchigatana.png" \
        "https://darksouls.fandom.com/wiki/Uchigatana?file=Uchigatana-lg.png"
fi

echo -e "\n✨ Download complete!"