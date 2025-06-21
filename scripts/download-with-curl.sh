#!/bin/bash

# Dark Souls Wiki Image Downloader using curl
# Downloads images from Fextralife wiki

BASE_DIR="assets/images"

# Function to download image
download_image() {
    local url=$1
    local filepath=$2
    local dirname=$(dirname "$filepath")
    
    # Create directory if it doesn't exist
    mkdir -p "$dirname"
    
    echo -n "Downloading $(basename $filepath)... "
    
    # Download with curl
    if curl -L -s -o "$filepath" "$url" --fail; then
        echo "✓"
        return 0
    else
        echo "✗"
        return 1
    fi
}

echo "Dark Souls Wiki Image Downloader"
echo "================================="

# Weapons
echo -e "\nDownloading weapons..."
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/zweihander.png" "$BASE_DIR/weapons/zweihander.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/claymore.png" "$BASE_DIR/weapons/claymore.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/uchigatana-lg.png" "$BASE_DIR/weapons/uchigatana.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/black_knight_sword.png" "$BASE_DIR/weapons/black-knight-sword.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/moonlight_greatsword.png" "$BASE_DIR/weapons/moonlight-greatsword.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/estoc.png" "$BASE_DIR/weapons/estoc.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/longsword.png" "$BASE_DIR/weapons/longsword.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/dark_hand.png" "$BASE_DIR/weapons/dark-hand.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dragonslayer_greataxe.png" "$BASE_DIR/weapons/dragonslayer-greataxe.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/farron_greatsword.png" "$BASE_DIR/weapons/farron-greatsword.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/frayed_blade.png" "$BASE_DIR/weapons/frayed-blade.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/friede%27s_great_scythe.png" "$BASE_DIR/weapons/friede-scythe.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/gael%27s_greatsword.png" "$BASE_DIR/weapons/gael-greatsword.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/lothric_knight_sword.png" "$BASE_DIR/weapons/lothric-knight-straight-sword.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/murky_hand_scythe.png" "$BASE_DIR/weapons/murky-hand-scythe.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ringed_knight_paired_greatswords.png" "$BASE_DIR/weapons/ringed-knight-paired-greatswords.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sellsword_twinblades.png" "$BASE_DIR/weapons/sellsword-twinblades.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/splitleaf_greatsword.png" "$BASE_DIR/weapons/splitleaf-greatsword.png"

# Bosses
echo -e "\nDownloading bosses..."
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/asylum_demon.jpg" "$BASE_DIR/bosses/asylum-demon.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/bell_gargoyle.jpg" "$BASE_DIR/bosses/bell-gargoyles.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/taurus_demon.jpg" "$BASE_DIR/bosses/taurus-demon.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/vordt_of_the_boreal_valley.jpg" "$BASE_DIR/bosses/vordt.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/crystal_sage.jpg" "$BASE_DIR/bosses/crystal-sage.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/abyss_watchers_small.jpg" "$BASE_DIR/bosses/abyss-watchers.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/iudex_gundyr_small.jpg" "$BASE_DIR/bosses/iudex-gundyr.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/curse-rotted_greatwood.jpg" "$BASE_DIR/bosses/curse-rotted-greatwood.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/aldrich_devourer_of_gods_small.jpg" "$BASE_DIR/bosses/aldrich-devourer-of-gods.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/champion_gundyr.jpg" "$BASE_DIR/bosses/champion-gundyr.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/dancer_of_the_boreal_valley.jpg" "$BASE_DIR/bosses/dancer-of-the-boreal-valley.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/darkeater_midir_small.jpg" "$BASE_DIR/bosses/darkeater-midir.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/demon_prince.jpg" "$BASE_DIR/bosses/demon-prince.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/lothric_younger_prince_small.jpg" "$BASE_DIR/bosses/lothric-younger-prince.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/nameless_king_small.jpg" "$BASE_DIR/bosses/nameless-king.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/pontiff_sulyvahn.jpg" "$BASE_DIR/bosses/pontiff-sulyvahn.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/sister_friede.jpg" "$BASE_DIR/bosses/sister-friede.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/slave_knight_gael_small.jpg" "$BASE_DIR/bosses/slave-knight-gael.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/soul_of_cinder_small.jpg" "$BASE_DIR/bosses/soul-of-cinder.jpg"

# Areas
echo -e "\nDownloading areas..."
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/firelink_shrine.jpg" "$BASE_DIR/areas/firelink-shrine.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/undead_burg.jpg" "$BASE_DIR/areas/undead-burg.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/anor_londo.jpg" "$BASE_DIR/areas/anor-londo.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/blighttown.jpg" "$BASE_DIR/areas/blighttown.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/undead_asylum.jpg" "$BASE_DIR/areas/northern-undead-asylum.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/undead_parish.jpg" "$BASE_DIR/areas/undead-parish.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/the_depths.jpg" "$BASE_DIR/areas/depths.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/valley_of_drakes.jpg" "$BASE_DIR/areas/valley-of-drakes.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/darkroot_garden.jpg" "$BASE_DIR/areas/darkroot-garden.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/darkroot_basin.jpg" "$BASE_DIR/areas/darkroot-basin.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/new_londo_ruins.jpg" "$BASE_DIR/areas/new-londo-ruins.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/sens_fortress.jpg" "$BASE_DIR/areas/sens-fortress.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/the_dukes_archives.jpg" "$BASE_DIR/areas/dukes-archives.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/crystal_cave.jpg" "$BASE_DIR/areas/crystal-cave.jpg"

# NPCs
echo -e "\nDownloading NPCs..."
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/solaire_of_astora.jpg" "$BASE_DIR/npcs/solaire.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/solaire_of_astora.jpg" "$BASE_DIR/npcs/solaire-of-astora.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/siegmeyer_of_catarina.jpg" "$BASE_DIR/npcs/siegmeyer.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/siegmeyer_of_catarina.jpg" "$BASE_DIR/npcs/siegmeyer-of-catarina.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/andre_of_astora.jpg" "$BASE_DIR/npcs/andre.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/patches_the_hyena.jpg" "$BASE_DIR/npcs/patches.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/patches_the_hyena.jpg" "$BASE_DIR/npcs/patches-ds1.jpg"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/oscar_of_astora.jpg" "$BASE_DIR/npcs/oscar-of-astora.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/fire_keeper.jpg" "$BASE_DIR/npcs/fire-keeper.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/hawkwood_the_deserter.jpg" "$BASE_DIR/npcs/hawkwood.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ludleth_of_courland.jpg" "$BASE_DIR/npcs/ludleth.jpg"

# Items
echo -e "\nDownloading items..."
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/estus_flask.png" "$BASE_DIR/items/estus-flask.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/ring_of_favor_and_protection.png" "$BASE_DIR/items/ring-of-favor.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/elite_knight_set.jpg" "$BASE_DIR/items/elite-knight-set.jpg"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/ashen_estus_flask.png" "$BASE_DIR/items/ashen-estus-flask.png"
download_image "https://darksouls3.wiki.fextralife.com/file/Dark-Souls-3/coiled_sword.png" "$BASE_DIR/items/coiled-sword.png"
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/fire_keeper_soul.png" "$BASE_DIR/items/fire-keeper-soul.png"

# Armor
echo -e "\nDownloading armor..."
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/elite_knight_set.jpg" "$BASE_DIR/armor/elite-knight-set.jpg"

# Shields
echo -e "\nDownloading shields..."
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/grass_crest_shield.png" "$BASE_DIR/shields/grass-crest-shield.png"

# Rings
echo -e "\nDownloading rings..."
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/ring_of_favor_and_protection.png" "$BASE_DIR/rings/ring-of-favor.png"

# Catalysts
echo -e "\nDownloading catalysts..."
download_image "https://darksouls.wiki.fextralife.com/file/Dark-Souls/pyromancy_flame.png" "$BASE_DIR/catalysts/pyromancy-flame.png"

echo -e "\n✨ Download complete!"