# Image Download Guide

This guide explains how to download images for the Dark Souls Wiki using the provided scripts.

## Available Scripts

We provide three different scripts to download images, so you can use whichever works best for your system:

1. **Node.js Script** (`scripts/download-images.js`)
2. **Python Script** (`scripts/download_images.py`)
3. **Bash Script** (`scripts/download-images.sh`)

## Quick Start

### Using npm (Recommended)

If you have Node.js installed:

```bash
npm run download-images
```

### Using Python

If you have Python 3 installed:

```bash
npm run download-images-py
# or directly:
python3 scripts/download_images.py
```

### Using Bash

If you're on macOS/Linux or have Git Bash on Windows:

```bash
npm run download-images-sh
# or directly:
bash scripts/download-images.sh
```

## What Gets Downloaded

The scripts will download images for:

- **Weapons**: Zweihander, Claymore, Uchigatana, Black Knight Sword, etc.
- **Bosses**: Asylum Demon, Bell Gargoyles, Taurus Demon, etc.
- **Areas**: Firelink Shrine, Undead Burg, Anor Londo, Blighttown, etc.
- **NPCs**: Solaire, Siegmeyer, Andre, etc.
- **Items**: Estus Flask, Ring of Favor, etc.

Images are saved to: `assets/images/{category}/{item-name}.{ext}`

## Requirements

### For Node.js Script
- Node.js 10+ installed
- No additional packages required (uses built-in modules)

### For Python Script
- Python 3.6+ installed
- `requests` library: `pip install requests`

### For Bash Script
- Bash shell
- Either `curl` or `wget` installed

## Troubleshooting

### Images Not Downloading

1. **Check Internet Connection**: Ensure you have a stable internet connection
2. **Firewall/Proxy**: Some networks may block image downloads
3. **Rate Limiting**: If many images fail, wait a few minutes and try again

### Script Not Running

- **Node.js**: Make sure Node.js is installed: `node --version`
- **Python**: Make sure Python 3 is installed: `python3 --version`
- **Bash**: Make sure you're using a bash-compatible shell

### Manual Download

If the scripts fail, you can manually download images:

1. Check `scripts/image-helper.js` for Google search URLs
2. Search for "Dark Souls [item name]" on Google Images
3. Download high-quality images (800px+ width recommended)
4. Save to the appropriate folder in `assets/images/`

## Adding More Images

To add more images to the download list:

1. Edit the script of your choice
2. Add new entries to the `IMAGE_URLS` object
3. Follow the existing format
4. Run the script again

## Legal Note

- Only download images you have the right to use
- Prefer official promotional images when available
- Take your own screenshots for personal use
- Always respect copyright and fair use guidelines

## Alternative Sources

If the default URLs don't work, try these sources:

1. **Official Sources**
   - Steam Store Page
   - Bandai Namco Press Kit
   - From Software Official Site

2. **Wiki Sources** (with attribution)
   - Fextralife Wiki
   - Wikidot Dark Souls Wiki
   - Fandom Dark Souls Wiki

3. **Your Own Screenshots**
   - Best option for avoiding copyright issues
   - Ensures consistent quality
   - Can capture exactly what you need