#!/bin/bash

# Create directory for weapon images
mkdir -p ../assets/images/weapons

# Function to download a weapon image
download_weapon() {
    local weapon_id="$1"
    local fextralife_name="$2"
    local url="https://darksouls.wiki.fextralife.com/${fextralife_name}"
    local filename="../assets/images/weapons/${weapon_id}.png"
    
    echo "Fetching page for $weapon_id..."
    
    # Download the page and extract image URL
    local page_content=$(wget -q -O - --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url")
    
    # Look for the weapon image URL in the page
    local image_url=$(echo "$page_content" | grep -oE 'https://darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"]+\.(png|jpg|jpeg)' | head -1)
    
    if [ -n "$image_url" ]; then
        echo "Found image URL: $image_url"
        echo "Downloading $weapon_id..."
        wget -q -O "$filename" --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$image_url"
        
        if [ -f "$filename" ] && [ -s "$filename" ]; then
            # Verify it's actually an image
            if file "$filename" | grep -q "image"; then
                echo "✓ Downloaded $weapon_id"
            else
                echo "✗ Invalid file for $weapon_id"
                rm -f "$filename"
            fi
        else
            echo "✗ Failed to download $weapon_id"
            rm -f "$filename"
        fi
    else
        echo "✗ No image URL found for $weapon_id"
    fi
}

# Test with a few weapons first
weapons=(
    "dagger|Dagger"
    "club|Club"
    "longsword|Longsword"
    "zweihander|Zweihander"
    "uchigatana|Uchigatana"
)

# Download each weapon image
for weapon in "${weapons[@]}"; do
    IFS='|' read -r weapon_id fextralife_name <<< "$weapon"
    download_weapon "$weapon_id" "$fextralife_name"
    # Add delay to be respectful
    sleep 1
done

echo ""
echo "Test download complete!"