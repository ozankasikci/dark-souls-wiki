#!/bin/bash

# Direct download of high-resolution weapon images

BASE_DIR="assets/images/weapons"

# Function to download with verbose output
download_direct() {
    local name=$1
    local url=$2
    local output="$BASE_DIR/${name}.png"
    
    echo -n "Downloading $name... "
    
    # Use wget if available, otherwise curl
    if command -v wget >/dev/null 2>&1; then
        if wget -q -O "$output" "$url" 2>/dev/null; then
            size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
            echo "✓ Success! ($(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size}B"))"
            return 0
        fi
    fi
    
    # Try with curl
    if curl -L -o "$output" \
        -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
        "$url" 2>/dev/null; then
        
        # Verify it's an image
        if file "$output" | grep -E "(PNG|JPEG|image)" >/dev/null && [ -s "$output" ]; then
            size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
            if [ "$size" -gt 5000 ]; then
                echo "✓ Success! ($(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size}B"))"
                return 0
            fi
        fi
    fi
    
    echo "✗ Failed"
    rm -f "$output"
    return 1
}

echo "🎮 Downloading High-Resolution Weapon Images"
echo "==========================================="
echo

# Try some known working URLs
download_direct "zweihander" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/zweihander.png"
download_direct "claymore" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/claymore.png"
download_direct "black-knight-sword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/black_knight_sword.png"
download_direct "longsword" "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/longsword.png"

# Alternative URLs
download_direct "uchigatana" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_Uchigatana.png"
download_direct "estoc" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_Estoc.png"

# Try DS1 URLs
download_direct "moonlight-greatsword" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_Moonlight_Butterfly_Horn.png"

echo
echo "✨ Complete! Checking results..."
echo "Total images: $(find $BASE_DIR -name "*.png" -o -name "*.jpg" | wc -l | tr -d ' ')"