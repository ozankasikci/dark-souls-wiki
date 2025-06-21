#!/bin/bash

# Download next 20 missing images

BASE_DIR="assets/images"

# Function to download image
download_image() {
    local url=$1
    local filepath=$2
    local dirname=$(dirname "$filepath")
    
    # Skip if file already exists
    if [ -f "$filepath" ]; then
        return 1
    fi
    
    # Create directory if it doesn't exist
    mkdir -p "$dirname"
    
    echo -n "Downloading $(basename $filepath)... "
    
    # Download with curl
    if curl -L -s -o "$filepath" "$url" --fail; then
        echo "✓"
        return 0
    else
        echo "✗"
        rm -f "$filepath"  # Remove failed download
        return 1
    fi
}

echo "Downloading next 20 missing images..."
echo "===================================="

count=0
max_downloads=20

# Bosses - we need these
echo -e "\nChecking bosses..."
[ $count -lt $max_downloads ] && download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/bell_gargoyle.jpg" "$BASE_DIR/bosses/bell-gargoyles.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/taurus_demon.jpg" "$BASE_DIR/bosses/taurus-demon.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/vordt_of_the_boreal_valley.jpg" "$BASE_DIR/bosses/vordt.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/crystal_sage.jpg" "$BASE_DIR/bosses/crystal-sage.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/abyss_watchers_small.jpg" "$BASE_DIR/bosses/abyss-watchers.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/iudex_gundyr_small.jpg" "$BASE_DIR/bosses/iudex-gundyr.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/curse-rotted_greatwood.jpg" "$BASE_DIR/bosses/curse-rotted-greatwood.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/aldrich_devourer_of_gods_small.jpg" "$BASE_DIR/bosses/aldrich-devourer-of-gods.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/champion_gundyr.jpg" "$BASE_DIR/bosses/champion-gundyr.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dancer_of_the_boreal_valley.jpg" "$BASE_DIR/bosses/dancer-of-the-boreal-valley.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/darkeater_midir_small.jpg" "$BASE_DIR/bosses/darkeater-midir.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/demon_prince.jpg" "$BASE_DIR/bosses/demon-prince.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/lothric_younger_prince_small.jpg" "$BASE_DIR/bosses/lothric-younger-prince.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/nameless_king_small.jpg" "$BASE_DIR/bosses/nameless-king.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/pontiff_sulyvahn.jpg" "$BASE_DIR/bosses/pontiff-sulyvahn.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sister_friede.jpg" "$BASE_DIR/bosses/sister-friede.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/slave_knight_gael_small.jpg" "$BASE_DIR/bosses/slave-knight-gael.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/soul_of_cinder_small.jpg" "$BASE_DIR/bosses/soul-of-cinder.jpg" && ((count++))

# Areas - continue if we haven't hit 20 yet
echo -e "\nChecking areas..."
[ $count -lt $max_downloads ] && download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/undead_burg.jpg" "$BASE_DIR/areas/undead-burg.jpg" && ((count++))
[ $count -lt $max_downloads ] && download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/anor_londo.jpg" "$BASE_DIR/areas/anor-londo.jpg" && ((count++))

echo -e "\n✨ Downloaded $count new images!"