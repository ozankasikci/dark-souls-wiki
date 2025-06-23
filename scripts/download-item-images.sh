#!/bin/bash

# Script to download item images from Dark Souls Fextralife wiki

cd "$(dirname "$0")"

# Function to download item image
download_item() {
    local item_id="$1"
    local fextralife_name="$2"
    local url="https://darksouls.wiki.fextralife.com/${fextralife_name}"
    local filename="../assets/images/items/${item_id}.png"
    
    # Skip if file already exists and is valid
    if [ -f "$filename" ] && file "$filename" | grep -q "image"; then
        echo "⏩ Skipping $item_id (already exists)"
        return
    fi
    
    # Also check for jpg version
    local jpg_filename="../assets/images/items/${item_id}.jpg"
    if [ -f "$jpg_filename" ] && file "$jpg_filename" | grep -q "image"; then
        echo "⏩ Skipping $item_id (already exists as jpg)"
        return
    fi
    
    echo "Fetching $item_id from $fextralife_name..."
    
    # Download the page and extract image URL
    local page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url")
    
    # Look for the item image URL in the page - try multiple patterns
    # Pattern 1: Look for item_*_icon.png pattern
    local image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/item_[^"'\''[:space:]]+_icon\.(png|jpg|jpeg)' | head -1)
    
    # Pattern 2: Look for numerical filenames (common for items)
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[0-9]+\.(png|jpg|jpeg)' | head -1)
    fi
    
    # Pattern 3: Look for src= attribute with any image
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -oE 'src="([^"]*darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"]+\.(png|jpg|jpeg))"' | sed 's/src="//;s/"//' | head -1)
    fi
    
    # Pattern 4: Look for markdown-style image links
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -oE '\!\[[^\]]*\]\(([^)]*darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^)]+\.(png|jpg|jpeg))\)' | sed 's/.*(\([^)]*\)).*/\1/' | head -1)
    fi
    
    # Pattern 5: Look for any image in the file/Dark-Souls directory
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]<>]+\.(png|jpg|jpeg)' | head -1)
    fi
    
    if [ -z "$image_url" ]; then
        echo "❌ Could not find image URL for $item_id"
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
            echo "✅ Successfully downloaded $item_id"
            # If it's actually a JPEG, rename it
            if file "$filename" | grep -q "JPEG"; then
                mv "$filename" "${filename%.png}.jpg"
                echo "  Renamed to .jpg (was JPEG format)"
            fi
        else
            echo "❌ Downloaded file is not a valid image for $item_id"
            rm "$filename"
        fi
    else
        echo "❌ Failed to download $item_id"
    fi
    
    # Small delay to be respectful
    sleep 1
}

echo "Starting item image downloads..."

# Consumables
download_item "estus-flask" "Estus+Flask"
download_item "divine-blessing" "Divine+Blessing"
download_item "green-blossom" "Green+Blossom"
download_item "purple-moss-clump" "Purple+Moss+Clump"
download_item "humanity" "Humanity"

# Ammunition
download_item "wooden-arrow" "Wooden+Arrow"
download_item "heavy-bolt" "Heavy+Bolt"

# Keys
download_item "basement-key" "Basement+Key"
download_item "cage-key" "Cage+Key"

# Souls
download_item "soul-of-sif" "Soul+of+Sif"
download_item "soul-of-ornstein" "Soul+of+Ornstein"

# Ore (Upgrade Materials)
download_item "titanite-shard" "Titanite+Shard"
download_item "twinkling-titanite" "Twinkling+Titanite"

# Tools
download_item "binoculars" "Binoculars"

# Projectiles
download_item "throwing-knife" "Throwing+Knife"

# Multiplayer Items
download_item "white-sign-soapstone" "White+Sign+Soapstone"

# Key/Bonfire Items
download_item "lordvessel" "Lordvessel"

# Unequippable
download_item "peculiar-doll" "Peculiar+Doll"

echo "Item image download complete!"

# Count results
echo ""
echo "Summary:"
total_count=$(ls ../assets/images/items/*.png ../assets/images/items/*.jpg 2>/dev/null | wc -l)
echo "Total item images: $total_count"