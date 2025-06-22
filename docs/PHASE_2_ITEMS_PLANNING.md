# Phase 2: Items Implementation Plan

## Overview
Phase 2 focuses on implementing comprehensive item subcategories following the same architectural patterns established for weapons, armor, shields, and rings in Phase 1.

## Scope
Implement 11 item subcategories based on Dark Souls Fextralife wiki structure:

### Item Subcategories to Implement

1. **Ammunition** - Arrows, bolts, throwing knives
2. **Consumables** - Healing items, buffs, temporary effects
3. **Embers** - Humanity and related items
4. **Key/Bonfire Items** - Quest items, important progression items
5. **Keys** - Door keys, cage keys, dungeon keys
6. **Multiplayer Items** - Invasion items, summoning items
7. **Ore** - Upgrade materials, titanite, twinkling titanite
8. **Projectiles** - Throwable items, bombs
9. **Souls** - Boss souls, special souls
10. **Tools** - Repair items, utility items
11. **Unequippable** - Quest items that can't be equipped

## Technical Architecture

### 1. Directory Structure
```
data/equipment/items/
├── manifest.json
├── ammunition/
│   ├── manifest.json
│   ├── standard-arrow.md
│   ├── large-arrow.md
│   └── ...
├── consumables/
│   ├── manifest.json
│   ├── estus-flask.md
│   ├── green-blossom.md
│   └── ...
├── embers/
│   ├── manifest.json
│   ├── humanity.md
│   ├── twin-humanities.md
│   └── ...
└── ... (other subcategories)
```

### 2. Navigation Integration
Update navbar to include items submenu:
```html
<li class="has-submenu">
    <a href="#equipment/items">Items</a>
    <ul class="submenu">
        <li><a href="#equipment/items/ammunition">Ammunition</a></li>
        <li><a href="#equipment/items/consumables">Consumables</a></li>
        <li><a href="#equipment/items/embers">Embers</a></li>
        <li><a href="#equipment/items/key-bonfire-items">Key/Bonfire Items</a></li>
        <li><a href="#equipment/items/keys">Keys</a></li>
        <li><a href="#equipment/items/multiplayer-items">Multiplayer Items</a></li>
        <li><a href="#equipment/items/ore">Ore</a></li>
        <li><a href="#equipment/items/projectiles">Projectiles</a></li>
        <li><a href="#equipment/items/souls">Souls</a></li>
        <li><a href="#equipment/items/tools">Tools</a></li>
        <li><a href="#equipment/items/unequippable">Unequippable</a></li>
    </ul>
</li>
```

### 3. Router Updates
Add item subcategory handling to router.js:
```javascript
// Handle item subcategory listings (e.g., #equipment/items/consumables)
if (type === 'equipment' && rest[0] === 'items' && rest.length === 2) {
    await this.loadItemCategoryListing(rest[1]);
    return;
}

// Handle individual item paths in loadContent method
else if (parts[0] === 'items' && parts.length === 3) {
    // Handle item subcategory paths like items/consumables/estus-flask
    contentType = `equipment/items/${parts[1]}`;
    contentId = parts[2];
    renderType = 'items';
}
```

### 4. Content System Updates

#### Content Loader (content-loader.js)
Add `loadItemSubcategories()` method following the pattern of rings:
```javascript
async loadItemSubcategories() {
    const allItems = [];
    try {
        const response = await fetch(`data/equipment/items/manifest.json?t=${Date.now()}`);
        if (response.ok) {
            const itemsManifest = await response.json();
            // Process each item subcategory...
        }
    }
    // Set itemCategory and itemCategoryTitle for each item
}
```

#### Content Renderer (content-renderer.js)
Add item category grouping logic:
```javascript
// For items, further group by item category
if (grouped.items && grouped.items.items.length > 0) {
    const itemsByCategory = grouped.items.items.reduce((acc, item) => {
        const category = item.itemCategory || 'other';
        if (!acc[category]) {
            acc[category] = {
                title: item.itemCategoryTitle || category,
                items: []
            };
        }
        acc[category].items.push(item);
        return acc;
    }, {});
}
```

### 5. Image Management
- Create download script for item images: `scripts/download-item-images.sh`
- Images stored in: `assets/images/items/`
- Update image manifest to include item images
- Use Fextralife as primary source for item images

### 6. CSS Styling
Add item-specific styles:
```css
.item-category-section {
    /* Style similar to weapon-category-section */
}

.items-thumbnail {
    /* Style for item thumbnails */
}
```

## Implementation Tasks

### Phase 2.1: Core Infrastructure
1. ✅ Create directory structure for all 11 item subcategories
2. ✅ Update main equipment manifest to point to items/manifest.json
3. ✅ Create individual subcategory manifests
4. ✅ Update navbar with items submenu
5. ✅ Add router support for item routes
6. ✅ Update content-renderer for item subcategories
7. ✅ Update content-loader with loadItemSubcategories method
8. ✅ Add CSS styles for item categories

### Phase 2.2: Content Creation
1. ✅ Create item markdown files for all subcategories
2. ✅ Populate with accurate Dark Souls 1 data
3. ✅ Ensure proper frontmatter with itemCategory
4. ✅ Add descriptions, stats, and locations

### Phase 2.3: Image Implementation
1. ✅ Create download script for item images
2. ✅ Download images from Fextralife
3. ✅ Update image manifest
4. ✅ Verify image loading works correctly

### Phase 2.4: Testing & Validation
1. ✅ Test all item subcategory navigation
2. ✅ Test individual item page loading
3. ✅ Verify images load correctly
4. ✅ Test responsive design
5. ✅ Validate content accuracy

## Success Criteria
- [ ] All 11 item subcategories accessible via navigation
- [ ] Individual item pages load without 404 errors
- [ ] Items display with proper images (not placeholders)
- [ ] Consistent user experience with existing equipment categories
- [ ] All item data accurate to Dark Souls 1

## Risk Mitigation
1. **Image Availability**: Some items may not have images on Fextralife
   - **Solution**: Create placeholder images or use generic item icons
2. **Content Volume**: 11 subcategories with potentially 100+ items
   - **Solution**: Focus on most important/common items first
3. **Naming Consistency**: Item names may vary between sources
   - **Solution**: Use Fextralife as canonical source, normalize IDs

## Dependencies
- Existing equipment system architecture (completed in Phase 1)
- Image download and management system
- Content rendering system
- Router and navigation system

## Timeline Estimate
- **Phase 2.1**: 2-3 hours (infrastructure setup)
- **Phase 2.2**: 4-6 hours (content creation)
- **Phase 2.3**: 2-3 hours (image implementation)
- **Phase 2.4**: 1-2 hours (testing)
- **Total**: 9-14 hours

## Notes
- Follow the exact same patterns established for weapons, armor, shields, and rings
- Maintain consistency in file naming, structure, and styling
- Prioritize user experience and navigation clarity
- Ensure all changes are backwards compatible