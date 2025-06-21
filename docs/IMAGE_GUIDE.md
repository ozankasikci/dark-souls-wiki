# Image Guide for Dark Souls Wiki

## Adding Images to the Wiki

### Image Sources
For Dark Souls Remastered images, you can find high-quality images from:

1. **Official Sources**
   - Dark Souls official website
   - Bandai Namco press kits
   - Steam store page

2. **Community Sources**
   - Fextralife Wiki (with attribution)
   - Dark Souls Wiki (with permission)
   - In-game screenshots (your own)

3. **Image Requirements**
   - Format: JPG or PNG
   - Weapons: 800x600px minimum
   - Bosses: 1200x800px minimum
   - Areas: 1200x800px minimum
   - NPCs: 600x800px minimum
   - Items: 400x400px minimum

### Directory Structure
```
assets/images/
├── weapons/      # Weapon images
├── bosses/       # Boss screenshots
├── areas/        # Location/area images
├── npcs/         # NPC character images
├── items/        # Item icons
└── placeholder.png  # Default placeholder
```

### How to Add Images

1. **Download/Capture Images**
   - Take screenshots in-game
   - Download from official sources
   - Ensure you have rights to use the image

2. **Process Images**
   - Resize to appropriate dimensions
   - Optimize file size (use tools like TinyPNG)
   - Name files using kebab-case matching the content ID

3. **Add to Project**
   - Place in appropriate folder
   - Update `image-downloader.js` with image data
   - Reference in content files

### Example Usage in Markdown

```markdown
![Zweihander](assets/images/weapons/zweihander.jpg)
```

### Legal Considerations
- Use official promotional images when available
- Take your own screenshots for game content
- Always provide attribution when required
- Respect copyright and fair use guidelines

### Placeholder System
The wiki uses a placeholder system for missing images. To enable:
1. Add a generic placeholder.png to assets/images/
2. The image loader will automatically use it for missing images