# Dark Souls Wiki

A comprehensive wiki for Dark Souls Remastered with guides on weapons, bosses, areas, and lore.

## Project Structure

```
dark-souls-wiki/
├── index.html          # Main entry point
├── assets/             # Static assets
│   ├── images/         # Image files
│   ├── fonts/          # Custom fonts
│   └── icons/          # Icon files
├── components/         # Reusable components
├── config/             # Configuration files
│   └── *.yaml          # YAML config files
├── data/               # Content data
│   ├── areas/          # Area guides
│   ├── bosses/         # Boss guides
│   ├── builds/         # Character builds
│   ├── equipment/      # Equipment data
│   ├── items/          # Item descriptions
│   ├── lore/           # Lore articles
│   ├── npcs/           # NPC information
│   └── quests/         # Quest guides
├── docs/               # Documentation
├── pages/              # Additional HTML pages
├── scripts/            # JavaScript files
│   ├── ad-manager.js   # Ad management
│   ├── animations.js   # Animations
│   ├── content-*.js    # Content handling
│   ├── navigation.js   # Navigation logic
│   ├── router.js       # Client-side routing
│   ├── search*.js      # Search functionality
│   └── script.js       # Main script
├── styles/             # CSS files
│   ├── styles.css      # Main styles
│   ├── content-*.css   # Content styles
│   ├── ad-styles.css   # Ad styles
│   └── search-*.css    # Search styles
└── tests/              # Test files
```

## Features

- **Dynamic Content Loading**: Markdown-based content system
- **Client-Side Routing**: SPA-like navigation
- **Search Functionality**: Find content quickly
- **Dark Souls Theme**: Authentic visual design
- **Ad Integration**: Non-intrusive ad placements
- **Responsive Design**: Works on all devices

## Development

The wiki uses vanilla JavaScript with no build process required. Simply open `index.html` in a web browser or serve with any static file server.

### Running Locally

```bash
# Using Python
python -m http.server 8089

# Using Node.js
npx http-server -p 8089

# Using PHP
php -S localhost:8089
```

## Content Management

Content is stored as Markdown files in the `data/` directory. Each category has its own folder with a `manifest.json` file listing all items.

## Customization

- **Styles**: Edit files in `styles/` directory
- **Scripts**: Modify files in `scripts/` directory
- **Content**: Add/edit Markdown files in `data/` directory
- **Configuration**: Update YAML files in `config/` directory