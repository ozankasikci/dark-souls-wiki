#!/bin/bash

# Download images with better error handling

BASE_DIR="assets/images"
count=0
max_downloads=20

# Function to download with retries
download_with_retry() {
    local url=$1
    local filepath=$2
    local dirname=$(dirname "$filepath")
    
    # Skip if already exists
    if [ -f "$filepath" ]; then
        echo "Already exists: $(basename $filepath)"
        return 1
    fi
    
    # Skip if we've hit the limit
    if [ $count -ge $max_downloads ]; then
        return 1
    fi
    
    mkdir -p "$dirname"
    
    echo -n "Downloading $(basename $filepath)... "
    
    # Try download with different user agents and follow redirects
    if curl -L -s -o "$filepath" \
        -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
        -H "Accept: image/*" \
        --connect-timeout 10 \
        --max-time 30 \
        "$url"; then
        
        # Check if file is valid (not empty or HTML error page)
        if [ -s "$filepath" ] && file "$filepath" | grep -q -E "image|JPEG|PNG"; then
            echo "✓"
            ((count++))
            return 0
        else
            echo "✗ (invalid file)"
            rm -f "$filepath"
            return 1
        fi
    else
        echo "✗ (download failed)"
        rm -f "$filepath"
        return 1
    fi
}

echo "Attempting to download up to $max_downloads images..."
echo "============================================"

# Try different URL patterns for Dark Souls 3 bosses
echo -e "\nTrying Dark Souls 3 bosses..."
download_with_retry "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/vordt.jpg" "$BASE_DIR/bosses/vordt.jpg"
download_with_retry "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/crystal_sage_enemy.jpg" "$BASE_DIR/bosses/crystal-sage.jpg"
download_with_retry "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/abyss_watchers.jpg" "$BASE_DIR/bosses/abyss-watchers.jpg"
download_with_retry "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/iudex_gundyr.jpg" "$BASE_DIR/bosses/iudex-gundyr.jpg"
download_with_retry "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/curse_rotted_greatwood.jpg" "$BASE_DIR/bosses/curse-rotted-greatwood.jpg"
download_with_retry "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/aldrich_devourer_of_gods.jpg" "$BASE_DIR/bosses/aldrich-devourer-of-gods.jpg"

# Try Dark Souls 1 bosses
echo -e "\nTrying Dark Souls 1 bosses..."
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Bell_Gargoyle.jpg" "$BASE_DIR/bosses/bell-gargoyles.jpg"
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Taurus_Demon_Render.jpg" "$BASE_DIR/bosses/taurus-demon.jpg"

# Try items
echo -e "\nTrying items..."
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Estus_Flask.png" "$BASE_DIR/items/estus-flask.png"
download_with_retry "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ashen-estus-flask.png" "$BASE_DIR/items/ashen-estus-flask.png"
download_with_retry "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/coiled-sword.png" "$BASE_DIR/items/coiled-sword.png"

# Try NPCs  
echo -e "\nTrying NPCs..."
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Solaire_of_Astora.jpg" "$BASE_DIR/npcs/solaire.jpg"
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/andre-of-astora.jpg" "$BASE_DIR/npcs/andre.jpg"
download_with_retry "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/fire-keeper-npc.jpg" "$BASE_DIR/npcs/fire-keeper.jpg"

# Try shields
echo -e "\nTrying shields..."
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Grass_Crest_Shield.png" "$BASE_DIR/shields/grass-crest-shield.png"

# Try rings
echo -e "\nTrying rings..."
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Ring_of_Favor_and_Protection.png" "$BASE_DIR/rings/ring-of-favor.png"

# Try catalysts
echo -e "\nTrying catalysts..."
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Pyromancy_Flame.png" "$BASE_DIR/catalysts/pyromancy-flame.png"

# Try more areas
echo -e "\nTrying areas..."
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Anor_Londo_Archway.jpg" "$BASE_DIR/areas/anor-londo.jpg"
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/blighttown_001.jpg" "$BASE_DIR/areas/blighttown.jpg"
download_with_retry "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Undead_Asylum_Ground_Floor.jpg" "$BASE_DIR/areas/northern-undead-asylum.jpg"

echo -e "\n✨ Successfully downloaded $count images!"