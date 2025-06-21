#!/bin/bash

BASE_DIR="assets/images/weapons"

# Final attempt with more URL patterns
echo "🔍 Final weapon image download attempt..."
echo "========================================"

# Function to try multiple URL patterns
try_patterns() {
    local weapon=$1
    local base_name=$2
    
    echo "Trying $weapon..."
    
    # Check current status
    if [ -f "$BASE_DIR/${weapon}.png" ]; then
        size=$(stat -f%z "$BASE_DIR/${weapon}.png" 2>/dev/null || stat -c%s "$BASE_DIR/${weapon}.png" 2>/dev/null)
        if [ "$size" -gt 10000 ]; then
            echo "  ✓ Already high-res (${size}B)"
            return 0
        else
            echo "  Current size: ${size}B - attempting upgrade..."
        fi
    fi
    
    # URL patterns to try
    local patterns=(
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${base_name}-icon.png"
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${base_name}_icon.png"
        "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/${base_name}.png"
        "https://darksouls.wiki.fextralife.com/file/Dark-Souls/${base_name}.png"
        "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_${base_name}.png"
    )
    
    for url in "${patterns[@]}"; do
        if curl -L -s -o "/tmp/test_weapon.png" "$url" 2>/dev/null; then
            if file "/tmp/test_weapon.png" | grep -E "image" >/dev/null; then
                size=$(stat -f%z "/tmp/test_weapon.png" 2>/dev/null || stat -c%s "/tmp/test_weapon.png" 2>/dev/null)
                if [ "$size" -gt 10000 ]; then
                    mv "/tmp/test_weapon.png" "$BASE_DIR/${weapon}.png"
                    echo "  ✓ Downloaded high-res version (${size}B)"
                    return 0
                fi
            fi
        fi
        rm -f "/tmp/test_weapon.png"
    done
    
    echo "  ✗ No high-res version found"
    return 1
}

# Try specific weapons that are still low-res
try_patterns "estoc" "estoc"
try_patterns "estoc" "Estoc"
try_patterns "longsword" "longsword"
try_patterns "longsword" "Longsword"
try_patterns "longsword" "long_sword"
try_patterns "friede-scythe" "friedes_great_scythe"
try_patterns "friede-scythe" "friede_great_scythe"
try_patterns "murky-hand-scythe" "murky_hand_scythe"

# Try creating high-res PNGs from game assets
echo
echo "Attempting game asset URLs..."
try_patterns "estoc" "estoc_wpn"
try_patterns "longsword" "wpn_longsword"

echo
echo "📊 Final Statistics:"
echo "==================="
find "$BASE_DIR" -name "*.png" -exec ls -la {} \; | awk '{print $5 " " $9}' | sort -nr | head -10
echo
echo "Total images: $(find $BASE_DIR \( -name "*.png" -o -name "*.svg" \) | wc -l | tr -d ' ')"
echo "High-res PNGs (>10KB): $(find $BASE_DIR -name "*.png" -size +10k | wc -l | tr -d ' ')"
echo "SVG placeholders: $(find $BASE_DIR -name "*.svg" | wc -l | tr -d ' ')"