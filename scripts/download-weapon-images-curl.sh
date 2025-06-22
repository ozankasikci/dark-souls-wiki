#!/bin/bash

# Create directory for weapon images
mkdir -p ../assets/images/weapons

# Function to download a weapon image
download_weapon() {
    local weapon_id="$1"
    local fextralife_name="$2"
    local url="https://darksouls.wiki.fextralife.com/${fextralife_name}"
    local filename="../assets/images/weapons/${weapon_id}.png"
    
    echo "Fetching page for $weapon_id from $url..."
    
    # Download the page and extract image URL
    local page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url")
    
    # Debug: Check if we got content
    if [ -z "$page_content" ]; then
        echo "✗ Failed to fetch page for $weapon_id"
        return
    fi
    
    # Look for the weapon image URL in the page - try multiple patterns
    local image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]]+\.(png|jpg|jpeg)' | head -1)
    
    # If relative URL, make it absolute
    if [[ "$image_url" == //* ]]; then
        image_url="https:$image_url"
    fi
    
    if [ -n "$image_url" ]; then
        echo "Found image URL: $image_url"
        echo "Downloading $weapon_id..."
        curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$image_url" -o "$filename"
        
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
        # Debug: Save a sample of the page to check structure
        echo "$page_content" | grep -i "file/Dark-Souls" | head -5
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
    echo "---"
    # Add delay to be respectful
    sleep 1
done

echo ""
echo "Test download complete!"