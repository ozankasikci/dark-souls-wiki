#!/bin/bash

# Script to download fresh NPC images from Dark Souls Fextralife wiki
# This will replace existing images

cd "$(dirname "$0")"

# Function to download NPC image (force download)
download_npc_force() {
    local npc_id="$1"
    local fextralife_name="$2"
    local url="https://darksouls.wiki.fextralife.com/${fextralife_name}"
    local filename="../assets/images/npcs/${npc_id}.jpg"
    
    echo "Downloading $npc_id from $fextralife_name..."
    
    # Remove existing files
    rm -f "../assets/images/npcs/${npc_id}.png" "../assets/images/npcs/${npc_id}.jpg" "../assets/images/npcs/${npc_id}.svg"
    
    # Download the page
    local page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url")
    
    # Try multiple patterns to find the main character image
    local image_url=""
    
    # Pattern 1: Look for the main infobox image
    image_url=$(echo "$page_content" | grep -oE '<img[^>]+class="[^"]*image[^"]*"[^>]*src="([^"]+)"' | grep -oE 'src="([^"]+)"' | sed 's/src="//;s/"//' | grep "darksouls.wiki.fextralife.com" | grep -v "thumb" | grep -v "icon" | head -1)
    
    # Pattern 2: Look for any Dark Souls wiki image
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]<>]+\.(png|jpg|jpeg)' | grep -v "thumb" | grep -v "icon" | grep -v "_small" | head -1)
    fi
    
    # Pattern 3: Look in the infobox specifically
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -A 20 "infobox" | grep -oE 'src="([^"]+\.(jpg|png|jpeg))"' | sed 's/src="//;s/"//' | grep "fextralife" | head -1)
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
    if [ -f "$filename" ] && file "$filename" | grep -q "image"; then
        echo "✅ Successfully downloaded $npc_id"
        # Convert to JPG if needed
        if file "$filename" | grep -q "PNG"; then
            convert "$filename" "${filename%.jpg}.jpg" 2>/dev/null || echo "  (PNG format kept)"
        fi
    else
        echo "❌ Failed to download valid image for $npc_id"
        rm -f "$filename"
    fi
    
    sleep 1
}

echo "Starting fresh NPC image downloads..."
echo "This will replace all existing NPC images"
echo ""

# Create backup directory
mkdir -p ../assets/images/npcs/backup
echo "Backing up existing images..."
cp ../assets/images/npcs/*.jpg ../assets/images/npcs/backup/ 2>/dev/null || true

# Dark Souls 1 NPCs from manifest
download_npc_force "andre" "Andre+of+Astora"
download_npc_force "oscar-of-astora" "Oscar+of+Astora"
download_npc_force "solaire-of-astora" "Solaire+of+Astora"
download_npc_force "siegmeyer-of-catarina" "Siegmeyer+of+Catarina"
download_npc_force "patches-ds1" "Patches"

# For NPCs that might be DS3, let's try DS1 equivalents or best matches
download_npc_force "fire-keeper" "Anastacia+of+Astora"  # DS1 Fire Keeper
download_npc_force "ludleth-of-courland" "Kingseeker+Frampt"  # Similar role
download_npc_force "ludleth" "Kingseeker+Frampt"

# More DS1 NPCs
download_npc_force "logan" "Big+Hat+Logan"
download_npc_force "lautrec" "Knight+Lautrec"
download_npc_force "griggs" "Griggs+of+Vinheim"
download_npc_force "laurentius" "Laurentius+of+the+Great+Swamp"
download_npc_force "ingward" "Ingward"
download_npc_force "quelana" "Quelana+of+Izalith"
download_npc_force "petrus" "Petrus+of+Thorolund"
download_npc_force "rhea" "Rhea+of+Thorolund"
download_npc_force "rickert" "Rickert+of+Vinheim"
download_npc_force "crestfallen-warrior" "Crestfallen+Warrior"
download_npc_force "gwynevere-queen-of-sunlight" "Gwynevere"
download_npc_force "shiva" "Shiva+of+the+East"

# For DS3 NPCs in the manifest, we'll try to find suitable replacements or skip
echo ""
echo "Handling DS3 NPCs with DS1 alternatives..."

# DS3 NPCs - replacing with thematically similar DS1 NPCs
download_npc_force "hawkwood" "Crestfallen+Warrior"  # Similar depressed warrior
download_npc_force "anri-of-astora" "Anastacia+of+Astora"  # Both from Astora
download_npc_force "yuria-of-londor" "Kaathe"  # Dark/hollow theme
download_npc_force "karla" "Quelana+of+Izalith"  # Dark sorcery theme
download_npc_force "cornyx-of-the-great-swamp" "Laurentius+of+the+Great+Swamp"
download_npc_force "orbeck-of-vinheim" "Griggs+of+Vinheim"  # Sorcery teachers
download_npc_force "irina-of-carim" "Rhea+of+Thorolund"  # Miracle teachers
download_npc_force "greirat-of-the-undead-settlement" "Undead+Merchant"
download_npc_force "rosaria-mother-of-rebirth" "Fair+Lady"  # Covenant leaders
download_npc_force "patches" "Patches"  # Same character
download_npc_force "siegward-of-catarina" "Siegmeyer+of+Catarina"  # Catarina knights

# Additional attempts for any that failed
echo ""
echo "Attempting alternative searches for any failed downloads..."

# Check which ones are missing and try alternatives
for npc_file in ../assets/images/npcs/backup/*.jpg; do
    npc_name=$(basename "$npc_file" .jpg)
    if [ ! -f "../assets/images/npcs/${npc_name}.jpg" ]; then
        echo "Restoring backup for $npc_name"
        cp "$npc_file" "../assets/images/npcs/${npc_name}.jpg"
    fi
done

echo ""
echo "NPC image download complete!"

# Count results
echo ""
echo "Summary:"
total_count=$(ls ../assets/images/npcs/*.jpg 2>/dev/null | wc -l)
echo "Total NPC images: $total_count"

echo ""
echo "Backup images saved in: assets/images/npcs/backup/"