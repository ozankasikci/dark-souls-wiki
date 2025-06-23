#!/bin/bash

# Script to download NPC images from Dark Souls Fextralife wiki

cd "$(dirname "$0")"

# Function to download NPC image
download_npc() {
    local npc_id="$1"
    local fextralife_name="$2"
    local url="https://darksouls.wiki.fextralife.com/${fextralife_name}"
    local filename="../assets/images/npcs/${npc_id}.png"
    
    # Skip if file already exists and is valid
    if [ -f "$filename" ] && file "$filename" | grep -q "image"; then
        echo "⏩ Skipping $npc_id (already exists)"
        return
    fi
    
    # Also check for jpg version
    local jpg_filename="../assets/images/npcs/${npc_id}.jpg"
    if [ -f "$jpg_filename" ] && file "$jpg_filename" | grep -q "image"; then
        echo "⏩ Skipping $npc_id (already exists as jpg)"
        return
    fi
    
    echo "Fetching $npc_id from $fextralife_name..."
    
    # Download the page and extract image URL
    local page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url")
    
    # Look for the NPC image URL in the page - try multiple patterns
    # Pattern 1: Look for character portrait images
    local image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]<>]+\.(png|jpg|jpeg)' | grep -v "thumb" | grep -v "icon" | head -1)
    
    # Pattern 2: If no image found, try a broader search
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -oE 'src="([^"]*darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"]+\.(png|jpg|jpeg))"' | sed 's/src="//;s/"//' | grep -v "thumb" | grep -v "icon" | head -1)
    fi
    
    if [ -z "$image_url" ]; then
        echo "❌ Could not find image URL for $npc_id"
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
            echo "✅ Successfully downloaded $npc_id"
            # If it's actually a JPEG, rename it
            if file "$filename" | grep -q "JPEG"; then
                mv "$filename" "${filename%.png}.jpg"
                echo "  Renamed to .jpg (was JPEG format)"
            fi
        else
            echo "❌ Downloaded file is not a valid image for $npc_id"
            rm "$filename"
        fi
    else
        echo "❌ Failed to download $npc_id"
    fi
    
    # Small delay to be respectful
    sleep 1
}

echo "Starting NPC image downloads from Fextralife..."

# Download images for Dark Souls 1 NPCs
download_npc "andre" "Andre+of+Astora"
download_npc "fire-keeper" "Anastacia+of+Astora"
download_npc "oscar-of-astora" "Oscar+of+Astora"
download_npc "patches-ds1" "Patches"
download_npc "siegmeyer-of-catarina" "Siegmeyer+of+Catarina"
download_npc "solaire-of-astora" "Solaire+of+Astora"

# Additional DS1 NPCs
download_npc "laurentius" "Laurentius+of+the+Great+Swamp"
download_npc "ingward" "Ingward"
download_npc "quelana" "Quelana+of+Izalith"
download_npc "petrus" "Petrus+of+Thorolund"
download_npc "rhea" "Rhea+of+Thorolund"
download_npc "rickert" "Rickert+of+Vinheim"
download_npc "crestfallen-warrior" "Crestfallen+Warrior"
download_npc "gwynevere-queen-of-sunlight" "Gwynevere+Princess+of+Sunlight"
download_npc "shiva" "Shiva+of+the+East"

# Some NPCs might be from DS3, let me check and add alternatives for those not in DS1
# For DS3 NPCs that we have in our manifest, we'll try to find DS1 equivalents or skip

# These are DS3 NPCs, so we'll skip or find alternatives
echo ""
echo "Note: Some NPCs in the manifest appear to be from DS3. Focusing on DS1 NPCs."

# Additional prominent DS1 NPCs we could add
download_npc "logan" "Big+Hat+Logan"
download_npc "lautrec" "Knight+Lautrec"
download_npc "griggs" "Griggs+of+Vinheim"

echo "NPC image download complete!"

# Count results
echo ""
echo "Summary:"
total_count=$(ls ../assets/images/npcs/*.png ../assets/images/npcs/*.jpg 2>/dev/null | wc -l)
echo "Total NPC images: $total_count"