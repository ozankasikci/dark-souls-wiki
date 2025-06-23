#!/bin/bash

# Script to download build images from Dark Souls wiki

cd "$(dirname "$0")"

# Function to download build image
download_build() {
    local build_id="$1"
    local search_terms="$2"
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
    
    echo "Searching for $build_id image with terms: $search_terms..."
    
    # Try to find an appropriate image based on search terms
    # For builds, we'll try to use character/armor images
    
    # Check if we have existing armor/weapon images we can use
    case "$build_id" in
        "giant-dad")
            # Use Zweihander or Giant armor image
            if [ -f "../assets/images/weapons/zweihander.png" ]; then
                cp "../assets/images/weapons/zweihander.png" "$filename"
                echo "✅ Used Zweihander image for Giant Dad"
                return
            fi
            ;;
        "glass-cannon-sorcerer")
            # Use Moonlight Greatsword or Sorcerer set image
            if [ -f "../assets/images/weapons/moonlight-greatsword.png" ]; then
                cp "../assets/images/weapons/moonlight-greatsword.png" "$filename"
                echo "✅ Used Moonlight Greatsword image for Sorcerer"
                return
            fi
            ;;
        "faith-paladin")
            # Use Grant or Paladin set image
            if [ -f "../assets/images/weapons/grant.png" ]; then
                cp "../assets/images/weapons/grant.png" "$filename"
                echo "✅ Used Grant image for Faith Paladin"
                return
            elif [ -f "../assets/images/weapons/grants.png" ]; then
                cp "../assets/images/weapons/grants.png" "$filename"
                echo "✅ Used Grant image for Faith Paladin"
                return
            fi
            ;;
        "quality-build")
            # Use Claymore image
            if [ -f "../assets/images/weapons/claymore.png" ]; then
                cp "../assets/images/weapons/claymore.png" "$filename"
                echo "✅ Used Claymore image for Quality Build"
                return
            fi
            ;;
    esac
    
    echo "⚠️  No suitable image found for $build_id"
}

echo "Starting build image setup..."

# Create builds image directory if it doesn't exist
mkdir -p ../assets/images/builds

# Download/copy images for each build
download_build "quality-build" "claymore knight"
download_build "giant-dad" "zweihander giant"
download_build "glass-cannon-sorcerer" "moonlight sorcerer"
download_build "faith-paladin" "grant paladin"

echo "Build image setup complete!"

# Count results
echo ""
echo "Summary:"
total_count=$(ls ../assets/images/builds/*.png ../assets/images/builds/*.jpg 2>/dev/null | wc -l)
echo "Total build images: $total_count"