#!/bin/bash

# Script to download ring images from Dark Souls Fextralife wiki

cd "$(dirname "$0")"

# Function to download ring image
download_ring() {
    local ring_id="$1"
    local fextralife_name="$2"
    local url="https://darksouls.wiki.fextralife.com/${fextralife_name}"
    local filename="../assets/images/rings/${ring_id}.png"
    
    # Skip if file already exists and is valid
    if [ -f "$filename" ] && file "$filename" | grep -q "image"; then
        echo "⏩ Skipping $ring_id (already exists)"
        return
    fi
    
    echo "Fetching $ring_id from $fextralife_name..."
    
    # Download the page and extract image URL
    local page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url")
    
    # Look for the ring image URL in the page (og:image meta tag first)
    local image_url=$(echo "$page_content" | grep -o 'property="og:image" content="[^"]*"' | grep -o 'https://darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[0-9]*\.png' | head -1)
    
    # If not found, try to find any Dark Souls image URLs
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -o 'https://darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[0-9]*\.png' | head -1)
    fi
    
    # If still not found, try a more general pattern
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -oE 'src="([^"]*darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"]+\.(png|jpg|jpeg))"' | sed 's/src="//;s/"//' | head -1)
    fi
    
    if [ -z "$image_url" ]; then
        echo "❌ Could not find image URL for $ring_id"
        return
    fi
    
    # Add https: if URL starts with //
    if [[ "$image_url" == //* ]]; then
        image_url="https:$image_url"
    fi
    
    echo "  Found image URL: $image_url"
    
    # Download the image
    curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$image_url" -o "$filename"
    
    # Verify the download
    if [ -f "$filename" ]; then
        if file "$filename" | grep -q "image"; then
            echo "✅ Successfully downloaded $ring_id"
            # If it's actually a JPEG, rename it
            if file "$filename" | grep -q "JPEG"; then
                mv "$filename" "${filename%.png}.jpg"
                echo "  Renamed to .jpg (was JPEG format)"
            fi
        else
            echo "❌ Downloaded file is not a valid image for $ring_id"
            rm "$filename"
        fi
    else
        echo "❌ Failed to download $ring_id"
    fi
    
    # Small delay to be respectful
    sleep 1
}

echo "Starting ring image downloads..."

# Offensive Rings
download_ring "hornet-ring" "Hornet+Ring"
download_ring "leo-ring" "Leo+Ring"
download_ring "bellowing-dragoncrest-ring" "Bellowing+Dragoncrest+Ring"
download_ring "ring-of-the-suns-firstborn" "Ring+of+the+Sun's+Firstborn"
download_ring "red-tearstone-ring" "Red+Tearstone+Ring"

# Defensive Rings
download_ring "ring-of-steel-protection" "Ring+of+Steel+Protection"
download_ring "blue-tearstone-ring" "Blue+Tearstone+Ring"
download_ring "flame-stoneplate-ring" "Flame+Stoneplate+Ring"
download_ring "thunder-stoneplate-ring" "Thunder+Stoneplate+Ring"
download_ring "magic-stoneplate-ring" "Magic+Stoneplate+Ring"
download_ring "speckled-stoneplate-ring" "Speckled+Stoneplate+Ring"
download_ring "ring-of-fog" "Ring+of+Fog"

# Utility Rings
download_ring "havels-ring" "Havel's+Ring"
download_ring "ring-of-favor-and-protection" "Ring+of+Favor+and+Protection"
download_ring "rusted-iron-ring" "Rusted+Iron+Ring"
download_ring "dark-wood-grain-ring" "Dark+Wood+Grain+Ring"
download_ring "ring-of-sacrifice" "Ring+of+Sacrifice"
download_ring "rare-ring-of-sacrifice" "Rare+Ring+of+Sacrifice"
download_ring "tiny-beings-ring" "Tiny+Being's+Ring"
download_ring "dusk-crown-ring" "Dusk+Crown+Ring"
download_ring "covenant-of-artorias" "Covenant+of+Artorias"

# Resistance Rings
download_ring "bloodbite-ring" "Bloodbite+Ring"
download_ring "poisonbite-ring" "Poisonbite+Ring"
download_ring "cursebite-ring" "Cursebite+Ring"
download_ring "lingering-dragoncrest-ring" "Lingering+Dragoncrest+Ring"

echo "Ring image download complete!"

# Count results
echo ""
echo "Summary:"
total_count=$(ls ../assets/images/rings/*.png ../assets/images/rings/*.jpg 2>/dev/null | wc -l)
echo "Total ring images: $total_count"