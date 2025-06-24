#!/bin/bash

# Script to download build images from appropriate sources

cd "$(dirname "$0")"

# Create builds image directory if it doesn't exist
mkdir -p ../assets/images/builds

# Function to download build image
download_build_image() {
    local build_id="$1"
    local image_url="$2"
    local filename="../assets/images/builds/${build_id}.jpg"
    
    if [ -f "$filename" ] && [ $(stat -f%z "$filename" 2>/dev/null || stat -c%s "$filename" 2>/dev/null) -gt 1000 ]; then
        echo "Image already exists for $build_id"
        return
    fi
    
    echo "Downloading $build_id..."
    
    # Determine if it's a PNG URL
    if [[ "$image_url" == *.png ]]; then
        local temp_file="../assets/images/builds/${build_id}_temp.png"
        curl -s -L -H "User-Agent: Mozilla/5.0" "$image_url" -o "$temp_file"
        
        if [ -f "$temp_file" ] && file "$temp_file" | grep -q "PNG image"; then
            # Convert PNG to JPG
            convert "$temp_file" "$filename" 2>/dev/null || cp "$temp_file" "${filename%.jpg}.png"
            rm -f "$temp_file"
            echo "✅ Successfully downloaded $build_id"
        else
            echo "❌ Failed to download $build_id"
            rm -f "$temp_file" "$filename"
        fi
    else
        curl -s -L -H "User-Agent: Mozilla/5.0" "$image_url" -o "$filename"
        
        if [ -f "$filename" ] && file "$filename" | grep -q "image"; then
            echo "✅ Successfully downloaded $build_id"
        else
            echo "❌ Failed to download $build_id"
            rm -f "$filename"
        fi
    fi
}

echo "Downloading build images..."

# Download images based on build themes
# Pyromancer - Great Swamp/Quelana theme
download_build_image "pyromancer" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/pyromancer-starting-class-male-dark-souls.jpg"

# Strength Build - Heavy warrior theme
download_build_image "strength-build" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/warrior-starting-class-male-dark-souls.jpg"

# Dexterity Build - Nimble warrior
download_build_image "dex-build" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/wanderer-starting-class-male-dark-souls.jpg"

# Intelligence Sorcerer - Big Hat Logan theme
download_build_image "int-sorcerer" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/sorcerer-starting-class-male-dark-souls.jpg"

# Havel Tank - Havel the Rock
download_build_image "havel-tank" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/knight-starting-class-male-dark-souls.jpg"

# Bleed Build - Lifehunt Scythe/Priscilla theme  
download_build_image "bleed-build" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/bandit-starting-class-male-dark-souls.jpg"

# Faith Cleric - Paladin Leeroy theme
download_build_image "faith-cleric" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/cleric-starting-class-male-dark-souls.jpg"

# Dragon Build - Path of the Dragon
download_build_image "dragon-build" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/deprived-starting-class-male-dark-souls.jpg"

# Stealth Assassin - Shadow/Thief theme
download_build_image "stealth-assassin" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/thief-starting-class-male-dark-souls.jpg"

# Artorias Cosplay - Artorias himself
download_build_image "artorias-cosplay" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/hunter-starting-class-male-dark-souls.jpg"

# Giant Dad - The Legend
download_build_image "giant-dad" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/giant-armor-set-dark-souls.jpg"

# Glass Cannon Sorcerer - Pure magic build
download_build_image "glass-cannon-sorcerer" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/sorcerer-starting-class-male-dark-souls.jpg"

# Quality Build - Balanced Str/Dex
download_build_image "quality-build" "https://darksouls.wiki.fextralife.com/file/Dark-Souls/knight-starting-class-male-dark-souls.jpg"

echo ""
echo "Build image download complete!"
echo "Total images: $(ls ../assets/images/builds/*.jpg 2>/dev/null | wc -l)"