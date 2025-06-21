# Dark Souls Wiki Data Structure

This directory contains all wiki content organized as markdown files with YAML frontmatter.

## Directory Structure

```
data/
├── areas/          # Game locations and zones
├── bosses/         # Boss encounters
├── items/          # Weapons, armor, consumables, etc.
├── npcs/           # Non-player characters
├── quests/         # Questlines and NPC storylines
└── lore/           # Game lore and story elements
```

## File Format

Each markdown file follows this structure:

```markdown
---
id: unique-identifier
name: Display Name
type: content-type
[additional metadata]
---

# Title

## Sections
Content organized with markdown headings and formatting
```

## Content Types

### Areas
- Location descriptions
- Connected areas
- Notable NPCs and items
- Environmental hazards

### Bosses
- Stats and weaknesses
- Attack patterns and phases
- Strategy guides
- Loot tables

### Items
- Item statistics
- Acquisition methods
- Upgrade paths
- Related items

### NPCs
- Character descriptions
- Services offered
- Quest involvement
- Dialogue options

### Quests
- Step-by-step walkthroughs
- Requirements and triggers
- Rewards
- Failure conditions

### Lore
- World history
- Character backgrounds
- Item descriptions
- Connections between elements

## Metadata Fields

Common frontmatter fields:
- `id`: Unique identifier (kebab-case)
- `name`: Display name
- `type`: Content category
- `category`: Sub-category (optional)
- `tags`: Related topics (optional)
- `related`: Links to other content (optional)