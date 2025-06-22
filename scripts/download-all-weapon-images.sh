#!/bin/bash

# Create directory for weapon images
mkdir -p ../assets/images/weapons

# Function to download a weapon image
download_weapon() {
    local weapon_id="$1"
    local fextralife_name="$2"
    local url="https://darksouls.wiki.fextralife.com/${fextralife_name}"
    local filename="../assets/images/weapons/${weapon_id}.png"
    
    # Skip if file already exists and is valid
    if [ -f "$filename" ] && file "$filename" | grep -q "image"; then
        echo "⏩ Skipping $weapon_id (already exists)"
        return
    fi
    
    echo "Fetching $weapon_id..."
    
    # Download the page and extract image URL
    local page_content=$(curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url")
    
    # Look for the weapon image URL in the page
    local image_url=$(echo "$page_content" | grep -oE '(https?:)?//darksouls\.wiki\.fextralife\.com/file/Dark-Souls/[^"'\''[:space:]]+\.(png|jpg|jpeg)' | head -1)
    
    # If relative URL, make it absolute
    if [[ "$image_url" == //* ]]; then
        image_url="https:$image_url"
    fi
    
    if [ -n "$image_url" ]; then
        curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$image_url" -o "$filename"
        
        if [ -f "$filename" ] && [ -s "$filename" ] && file "$filename" | grep -q "image"; then
            echo "✓ Downloaded $weapon_id"
        else
            echo "✗ Failed to download $weapon_id"
            rm -f "$filename"
        fi
    else
        echo "✗ No image found for $weapon_id"
    fi
}

# Complete weapon list from the original mapping
weapons=(
    # Daggers
    "dagger|Dagger"
    "parrying-dagger|Parrying+Dagger"
    "ghost-blade|Ghost+Blade"
    "bandits-knife|Bandit's+Knife"
    "priscillas-dagger|Priscilla's+Dagger"
    "dark-silver-tracer|Dark+Silver+Tracer"
    
    # Straight Swords
    "straight-sword-hilt|Straight+Sword+Hilt"
    "broken-straight-sword|Broken+Straight+Sword"
    "broadsword|Broadsword"
    "shortsword|Shortsword"
    "longsword|Longsword"
    "barbed-straight-sword|Barbed+Straight+Sword"
    "balder-side-sword|Balder+Side+Sword"
    "crystal-straight-sword|Crystal+Straight+Sword"
    "sunlight-straight-sword|Sunlight+Straight+Sword"
    "astoras-straight-sword|Astora's+Straight+Sword"
    "drake-sword|Drake+Sword"
    "darksword|Darksword"
    "silver-knight-straight-sword|Silver+Knight+Straight+Sword"
    
    # Greatswords
    "bastard-sword|Bastard+Sword"
    "claymore|Claymore"
    "mans-serpent-greatsword|Man-serpent+Greatsword"
    "flamberge|Flamberge"
    "crystal-greatsword|Crystal+Greatsword"
    "stone-greatsword|Stone+Greatsword"
    "greatsword-of-artorias|Greatsword+of+Artorias"
    "greatsword-of-artorias-cursed|Greatsword+of+Artorias+(Cursed)"
    "great-lord-greatsword|Great+Lord+Greatsword"
    "obsidian-greatsword|Obsidian+Greatsword"
    "moonlight-greatsword|Moonlight+Greatsword"
    "black-knight-sword|Black+Knight+Sword"
    "abyss-greatsword|Abyss+Greatsword"
    
    # Ultra Greatswords
    "zweihander|Zweihander"
    "greatsword|Greatsword"
    "demon-great-machete|Demon+Great+Machete"
    "dragon-greatsword|Dragon+Greatsword"
    "black-knight-greatsword|Black+Knight+Greatsword"
    
    # Curved Swords
    "scimitar|Scimitar"
    "falchion|Falchion"
    "shotel|Shotel"
    "jagged-ghost-blade|Jagged+Ghost+Blade"
    "painting-guardian-sword|Painting+Guardian+Sword"
    "quelaags-furysword|Quelaag's+Furysword"
    
    # Katanas
    "uchigatana|Uchigatana"
    "washing-pole|Washing+Pole"
    "iaito|Iaito"
    "chaos-blade|Chaos+Blade"
    
    # Curved Greatswords
    "server|Server"
    "murakumo|Murakumo"
    "gravelord-sword|Gravelord+Sword"
    
    # Piercing Swords
    "rapier|Rapier"
    "estoc|Estoc"
    "mail-breaker|Mail+Breaker"
    "ricards-rapier|Ricard's+Rapier"
    "velkas-rapier|Velka's+Rapier"
    
    # Axes
    "hand-axe|Hand+Axe"
    "battle-axe|Battle+Axe"
    "crescent-axe|Crescent+Axe"
    "butcher-knife|Butcher+Knife"
    "golem-axe|Golem+Axe"
    "gargoyle-tail-axe|Gargoyle+Tail+Axe"
    
    # Great Axes
    "greataxe|Greataxe"
    "demons-greataxe|Demon's+Greataxe"
    "dragon-king-greataxe|Dragon+King+Greataxe"
    "black-knight-greataxe|Black+Knight+Greataxe"
    
    # Hammers
    "club|Club"
    "mace|Mace"
    "morning-star|Morning+Star"
    "warpick|Warpick"
    "reinforced-club|Reinforced+Club"
    "blacksmiths-hammer|Blacksmith's+Hammer"
    "hammer-of-vamos|Hammer+of+Vamos"
    
    # Great Hammers
    "great-club|Great+Club"
    "grants|Grant"
    "demons-great-hammer|Demon's+Great+Hammer"
    "dragon-tooth|Dragon+Tooth"
    "large-club|Large+Club"
    "smoughs-hammer|Smough's+Hammer"
    
    # Fist Weapons
    "caestus|Caestus"
    "claw|Claw"
    "dragon-bone-fist|Dragon+Bone+Fist"
    "dark-hand|Dark+Hand"
    
    # Spears
    "spear|Spear"
    "winged-spear|Winged+Spear"
    "partisan|Partisan"
    "pike|Pike"
    "demons-spear|Demon's+Spear"
    "silver-knight-spear|Silver+Knight+Spear"
    "moonlight-butterfly-horn|Moonlight+Butterfly+Horn"
    "dragonslayer-spear|Dragonslayer+Spear"
    "channelers-trident|Channeler's+Trident"
    "four-pronged-plow|Four-pronged+Plow"
    
    # Halberds
    "halberd|Halberd"
    "gargoyle-halberd|Gargoyle's+Halberd"
    "titanite-catch-pole|Titanite+Catch+Pole"
    "scythe|Scythe"
    "lucerne|Lucerne"
    "giants-halberd|Giant's+Halberd"
    "black-knight-halberd|Black+Knight+Halberd"
    
    # Whips
    "whip|Whip"
    "notched-whip|Notched+Whip"
    
    # Bows
    "short-bow|Short+Bow"
    "longbow|Longbow"
    "composite-bow|Composite+Bow"
    "black-bow-of-pharis|Black+Bow+of+Pharis"
    
    # Crossbows
    "light-crossbow|Light+Crossbow"
    "heavy-crossbow|Heavy+Crossbow"
    "sniper-crossbow|Sniper+Crossbow"
    "avelyn|Avelyn"
    
    # Catalysts
    "sorcerers-catalyst|Sorcerer's+Catalyst"
    "oolacile-ivory-catalyst|Oolacile+Ivory+Catalyst"
    "logans-catalyst|Logan's+Catalyst"
    "tin-crystallization-catalyst|Tin+Crystallization+Catalyst"
    "tin-banishment-catalyst|Tin+Banishment+Catalyst"
    "manus-catalyst|Manus+Catalyst"
    "tin-darkmoon-catalyst|Tin+Darkmoon+Catalyst"
    
    # Talismans
    "talisman|Talisman"
    "canvas-talisman|Canvas+Talisman"
    "darkmoon-talisman|Darkmoon+Talisman"
    
    # Flames
    "pyromancy-flame|Pyromancy+Flame"
    "ascended-pyromancy-flame|Pyromancy+Flame+%2B15"
)

# Counter for progress
total=${#weapons[@]}
current=0
success=0
failed=0

echo "Starting download of $total weapon images..."
echo ""

# Download each weapon image
for weapon in "${weapons[@]}"; do
    IFS='|' read -r weapon_id fextralife_name <<< "$weapon"
    ((current++))
    echo "[$current/$total] Processing $weapon_id..."
    download_weapon "$weapon_id" "$fextralife_name"
    
    # Check result
    if [ -f "../assets/images/weapons/${weapon_id}.png" ] && file "../assets/images/weapons/${weapon_id}.png" | grep -q "image"; then
        ((success++))
    else
        ((failed++))
    fi
    
    # Add small delay to be respectful to the server
    sleep 0.5
done

echo ""
echo "=== Download Complete ==="
echo "Total: $total"
echo "Success: $success"
echo "Failed: $failed"
echo "Images saved to: ../assets/images/weapons/"