#!/bin/bash

# Quick download script for specific Dark Souls images

echo "Downloading additional Dark Souls images..."

# Create directories if they don't exist
mkdir -p assets/images/{weapons,bosses,areas,npcs,items}

# Download more weapon images
echo "Downloading weapon images..."

# Download from alternative sources with correct filenames
curl -L -s "https://darksouls.wiki.fextralife.com/file/Dark-Souls/wpn_greatsword.png" -o "assets/images/weapons/black-knight-sword.png" || echo "Failed: black-knight-sword"
curl -L -s "https://darksouls.wiki.fextralife.com/file/Dark-Souls/wpn_moonlight_greatsword.png" -o "assets/images/weapons/moonlight-greatsword.png" || echo "Failed: moonlight-greatsword"
curl -L -s "https://darksouls.wiki.fextralife.com/file/Dark-Souls/Wpn_Estoc.png" -o "assets/images/weapons/estoc.png" || echo "Failed: estoc"
curl -L -s "https://darksouls.wiki.fextralife.com/file/Dark-Souls/long_sword.png" -o "assets/images/weapons/longsword.png" || echo "Failed: longsword"

# Try to get some boss images
echo "Downloading boss images..."
curl -L -s "https://i.imgur.com/PuKkPXi.jpg" -o "assets/images/bosses/asylum-demon.jpg" || echo "Failed: asylum-demon"

# Try to get some area images  
echo "Downloading area images..."
curl -L -s "https://i.imgur.com/L5o3mME.jpg" -o "assets/images/areas/firelink-shrine.jpg" || echo "Failed: firelink-shrine"

# Download a better placeholder
echo "Creating enhanced placeholder..."
cat > assets/images/placeholder.svg << 'EOF'
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad">
      <stop offset="0%" style="stop-color:#2a2a2a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgGrad)"/>
  <text x="200" y="140" font-family="Arial, sans-serif" font-size="20" fill="#ff8c00" text-anchor="middle" dominant-baseline="middle">
    Dark Souls
  </text>
  <text x="200" y="165" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle" dominant-baseline="middle">
    Image Loading...
  </text>
  <path d="M180 110 L220 110 L220 130 L180 130 Z" fill="none" stroke="#ff8c00" stroke-width="2" opacity="0.5"/>
  <circle cx="200" cy="120" r="3" fill="#ff8c00" opacity="0.7"/>
</svg>
EOF

echo "Download complete. Check assets/images/ for new files."

# List what we have
echo -e "\nCurrent images:"
find assets/images -name "*.png" -o -name "*.jpg" -o -name "*.svg" | sort