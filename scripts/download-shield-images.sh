#!/bin/bash

# Script to download shield images from Dark Souls Fextralife wiki

cd "$(dirname "$0")"

# Function to download shield image
download_shield() {
    local shield_id="$1"
    local fextralife_name="$2"
    local url="https://darksouls.wiki.fextralife.com/${fextralife_name}"
    local filename="../assets/images/shields/${shield_id}.png"
    
    # Skip if file already exists and is valid
    if [ -f "$filename" ] && file "$filename" | grep -q "image"; then
        echo "⏩ Skipping $shield_id (already exists)"
        return
    fi
    
    echo "Fetching $shield_id from $fextralife_name..."
    
    # Download the page and extract image URL
    local page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url")
    
    # Look for the shield image URL in the page
    local image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]]+\.(png|jpg|jpeg)' | grep -i "${fextralife_name}" | head -1)
    
    # If not found, try another pattern
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]]*shield[^"'\''[:space:]]*\.(png|jpg|jpeg)' | head -1)
    fi
    
    # If still not found, try a more general pattern
    if [ -z "$image_url" ]; then
        image_url=$(echo "$page_content" | grep -oE 'src="([^"]*darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"]+\.(png|jpg|jpeg))"' | sed 's/src="//;s/"//' | head -1)
    fi
    
    if [ -z "$image_url" ]; then
        echo "❌ Could not find image URL for $shield_id"
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
            echo "✅ Successfully downloaded $shield_id"
            # If it's actually a JPEG, rename it
            if file "$filename" | grep -q "JPEG"; then
                mv "$filename" "${filename%.png}.jpg"
                echo "  Renamed to .jpg (was JPEG format)"
            fi
        else
            echo "❌ Downloaded file is not a valid image for $shield_id"
            rm "$filename"
        fi
    else
        echo "❌ Failed to download $shield_id"
    fi
    
    # Small delay to be respectful
    sleep 1
}

echo "Starting shield image downloads..."

# Small Shields
download_shield "buckler" "Buckler"
download_shield "target-shield" "Target+Shield"
download_shield "small-leather-shield" "Small+Leather+Shield"
download_shield "caduceus-round-shield" "Caduceus+Round+Shield"
download_shield "red-and-white-round-shield" "Red+and+White+Round+Shield"
download_shield "plank-shield" "Plank+Shield"
download_shield "leather-shield" "Leather+Shield"
download_shield "cracked-round-shield" "Cracked+Round+Shield"
download_shield "effigy-shield" "Effigy+Shield"
download_shield "crystal-ring-shield" "Crystal+Ring+Shield"

# Medium Shields
download_shield "grass-crest-shield" "Grass+Crest+Shield"
download_shield "heater-shield" "Heater+Shield"
download_shield "knight-shield" "Knight+Shield"
download_shield "kite-shield" "Kite+Shield"
download_shield "balder-shield" "Balder+Shield"
download_shield "crest-shield" "Crest+Shield"
download_shield "dragon-crest-shield" "Dragon+Crest+Shield"
download_shield "spider-shield" "Spider+Shield"
download_shield "eagle-shield" "Eagle+Shield"
download_shield "tower-kite-shield" "Tower+Kite+Shield"
download_shield "caduceus-kite-shield" "Caduceus+Kite+Shield"
download_shield "hollow-soldier-shield" "Hollow+Soldier+Shield"
download_shield "wooden-shield" "Wooden+Shield"
download_shield "large-leather-shield" "Large+Leather+Shield"
download_shield "silver-knight-shield" "Silver+Knight+Shield"
download_shield "black-knight-shield" "Black+Knight+Shield"
download_shield "pierce-shield" "Pierce+Shield"
download_shield "spiked-shield" "Spiked+Shield"
download_shield "crystal-shield" "Crystal+Shield"
download_shield "sunlight-shield" "Sunlight+Shield"
download_shield "iron-round-shield" "Iron+Round+Shield"
download_shield "bloodshield" "Bloodshield"
download_shield "sanctus" "Sanctus"

# Greatshields
download_shield "havels-greatshield" "Havel's+Greatshield"
download_shield "greatshield-of-artorias" "Greatshield+of+Artorias"
download_shield "tower-shield" "Tower+Shield"
download_shield "black-iron-greatshield" "Black+Iron+Greatshield"
download_shield "eagle-greatshield" "Eagle+Greatshield"
download_shield "stone-greatshield" "Stone+Greatshield"
download_shield "bonewheel-shield" "Bonewheel+Shield"
download_shield "cleansing-greatshield" "Cleansing+Greatshield"
download_shield "giant-shield" "Giant+Shield"

# Unique Shields
download_shield "skull-shield" "Skull+Shield"

echo "Shield image download complete!"

# Count results
echo ""
echo "Summary:"
total_count=$(ls ../assets/images/shields/*.png ../assets/images/shields/*.jpg 2>/dev/null | wc -l)
echo "Total shield images: $total_count"