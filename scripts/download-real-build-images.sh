#!/bin/bash

# Script to download proper build images from various sources

cd "$(dirname "$0")"

# Function to download build image
download_build_image() {
    local build_id="$1"
    local url="$2"
    local filename="../assets/images/builds/${build_id}.png"
    
    # Skip if file already exists and is valid
    if [ -f "$filename" ] && file "$filename" | grep -q "image"; then
        echo "⏩ Skipping $build_id (already exists)"
        return
    fi
    
    # Also check for jpg version
    local jpg_filename="../assets/images/builds/${build_id}.jpg"
    if [ -f "$jpg_filename" ] && file "$jpg_filename" | grep -q "image"; then
        echo "⏩ Skipping $build_id (already exists as jpg)"
        return
    fi
    
    echo "Downloading $build_id image..."
    
    # Download the image
    curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url" -o "$filename"
    
    # Verify the download
    if [ -f "$filename" ]; then
        if file "$filename" | grep -q "image"; then
            echo "✅ Successfully downloaded $build_id"
            # If it's actually a JPEG, rename it
            if file "$filename" | grep -q "JPEG"; then
                mv "$filename" "${filename%.png}.jpg"
                echo "  Renamed to .jpg (was JPEG format)"
            fi
        else
            echo "❌ Downloaded file is not a valid image for $build_id"
            rm "$filename"
        fi
    else
        echo "❌ Failed to download $build_id"
    fi
}

echo "Starting proper build image downloads..."

# Create builds image directory if it doesn't exist
mkdir -p ../assets/images/builds

# For builds, we'll use character/class images or composite images

# Giant Dad - Use Giant's armor set image
echo "Searching for Giant Dad image..."
# Try to use the giant armor set image or mask of the father
if [ -f "../assets/images/armor/giant-set.jpg" ]; then
    cp "../assets/images/armor/giant-set.jpg" "../assets/images/builds/giant-dad.jpg"
    echo "✅ Used Giant armor set image for Giant Dad"
else
    # Download from Fextralife
    page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0" "https://darksouls.wiki.fextralife.com/Giant+Armor+Set")
    image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]<>]+giant[^"'\''[:space:]<>]*\.(png|jpg|jpeg)' | head -1)
    if [ ! -z "$image_url" ]; then
        [[ "$image_url" == //* ]] && image_url="https:$image_url"
        download_build_image "giant-dad" "$image_url"
    fi
fi

# Glass Cannon Sorcerer - Use sorcerer set or crown of dusk
echo "Searching for Sorcerer build image..."
if [ -f "../assets/images/armor/sorcerer-set.jpg" ]; then
    cp "../assets/images/armor/sorcerer-set.jpg" "../assets/images/builds/glass-cannon-sorcerer.jpg"
    echo "✅ Used Sorcerer armor set image"
else
    # Try crown of dusk
    page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0" "https://darksouls.wiki.fextralife.com/Crown+of+Dusk")
    image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]<>]+crown[^"'\''[:space:]<>]*\.(png|jpg|jpeg)' | head -1)
    if [ ! -z "$image_url" ]; then
        [[ "$image_url" == //* ]] && image_url="https:$image_url"
        download_build_image "glass-cannon-sorcerer" "$image_url"
    fi
fi

# Faith Paladin - Use paladin set
echo "Searching for Paladin build image..."
if [ -f "../assets/images/armor/paladin-set.jpg" ]; then
    cp "../assets/images/armor/paladin-set.jpg" "../assets/images/builds/faith-paladin.jpg"
    echo "✅ Used Paladin armor set image"
else
    # Download paladin set from Fextralife
    page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0" "https://darksouls.wiki.fextralife.com/Paladin+Set")
    image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]<>]+paladin[^"'\''[:space:]<>]*\.(png|jpg|jpeg)' | head -1)
    if [ ! -z "$image_url" ]; then
        [[ "$image_url" == //* ]] && image_url="https:$image_url"
        download_build_image "faith-paladin" "$image_url"
    fi
fi

# Quality Build - Use elite knight set
echo "Searching for Quality build image..."
if [ -f "../assets/images/armor/elite-knight-set.jpg" ]; then
    cp "../assets/images/armor/elite-knight-set.jpg" "../assets/images/builds/quality-build.jpg"
    echo "✅ Used Elite Knight armor set image"
fi

# Small delay between downloads
sleep 1

echo "Build image download complete!"

# Count results
echo ""
echo "Summary:"
total_count=$(ls ../assets/images/builds/*.png ../assets/images/builds/*.jpg 2>/dev/null | wc -l)
echo "Total build images: $total_count"