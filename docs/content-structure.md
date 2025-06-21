# Dark Souls Wiki MVP Content Structure

## Core Categories

### 1. Weapons
Location: `/content/weapons/`

#### Frontmatter Template
```yaml
---
title: "Weapon Name"
category: "weapon"
type: "straight-sword" # Options: straight-sword, greatsword, ultra-greatsword, curved-sword, katana, thrusting-sword, axe, great-axe, hammer, great-hammer, spear, halberd, scythe, whip, bow, crossbow, catalyst, talisman, pyromancy-flame, fist, claw
damage_type: ["physical", "magic", "fire", "lightning"] # Can be multiple
base_damage:
  physical: 100
  magic: 0
  fire: 0
  lightning: 0
scaling:
  strength: "C" # Options: S, A, B, C, D, E, -
  dexterity: "D"
  intelligence: "-"
  faith: "-"
requirements:
  strength: 10
  dexterity: 10
  intelligence: 0
  faith: 0
weight: 3.0
durability: 200
upgrade_path: "normal" # Options: normal, raw, crystal, magic, enchanted, divine, occult, fire, chaos, lightning, unique
location: "Found in Undead Burg"
boss_weapon: false
unique: false
---
```

### 2. Bosses
Location: `/content/bosses/`

#### Frontmatter Template
```yaml
---
title: "Boss Name"
category: "boss"
type: "main" # Options: main, optional, mini-boss
location: "Undead Burg"
health: 1000
souls: 3000
weakness: ["fire", "lightning"]
resistance: ["magic", "poison"]
drops:
  - name: "Boss Soul"
    chance: "100%"
  - name: "Titanite Slab"
    chance: "10%"
strategies:
  - "Stay close to avoid ranged attacks"
  - "Watch for grab attack at 50% health"
required_for_progression: true
respawns: false
summons_available: ["Solaire of Astora", "Phantom Name"]
---
```

### 3. Areas
Location: `/content/areas/`

#### Frontmatter Template
```yaml
---
title: "Area Name"
category: "area"
type: "main-path" # Options: main-path, optional, secret, dlc
region: "Lordran" # Options: Lordran, Oolacile (DLC)
connections:
  - to: "Firelink Shrine"
    requirements: "None"
  - to: "Undead Parish"
    requirements: "Open gate with Basement Key"
bonfires:
  - name: "Undead Burg Bonfire"
    location: "Near merchant"
  - name: "Sunlight Altar"
    location: "After Hellkite Drake bridge"
bosses:
  - "Taurus Demon"
  - "Capra Demon"
notable_items:
  - "Black Firebombs"
  - "Gold Pine Resin"
  - "Blue Tearstone Ring"
npcs:
  - name: "Undead Merchant (Male)"
    location: "Near first bonfire"
  - name: "Solaire of Astora"
    location: "After Taurus Demon"
enemies:
  - "Hollow Soldier"
  - "Hollow Archer"
  - "Black Knight"
level_range: "1-20"
---
```

## Directory Structure

```
/content/
├── weapons/
│   ├── straight-swords/
│   │   ├── longsword.md
│   │   ├── balder-side-sword.md
│   │   └── sunlight-straight-sword.md
│   ├── greatswords/
│   │   ├── claymore.md
│   │   └── moonlight-greatsword.md
│   └── _index.md (weapons category page)
├── bosses/
│   ├── main/
│   │   ├── asylum-demon.md
│   │   ├── taurus-demon.md
│   │   └── bell-gargoyles.md
│   ├── optional/
│   │   ├── moonlight-butterfly.md
│   │   └── stray-demon.md
│   └── _index.md (bosses category page)
└── areas/
    ├── main-path/
    │   ├── undead-asylum.md
    │   ├── firelink-shrine.md
    │   └── undead-burg.md
    ├── optional/
    │   ├── ash-lake.md
    │   └── painted-world.md
    └── _index.md (areas category page)
```

## Content Guidelines

### Weapons
- Include damage values at base level
- Specify upgrade paths and materials needed
- Note any special effects or unique properties
- Include acquisition methods

### Bosses
- List all attack patterns
- Include recommended level ranges
- Note any special mechanics or phases
- List all possible drops with rates

### Areas
- Map out all connections and requirements
- List all bonfires with specific locations
- Include comprehensive enemy lists
- Note any special events or triggers

## Metadata Standards

### Common Fields
- `title`: Display name (use official English names)
- `category`: Main content type
- `type`: Subcategory for filtering
- All numeric values should be integers unless decimals are required (e.g., weight)
- Use arrays for multiple values
- Use nested objects for grouped data

### Naming Conventions
- File names: lowercase with hyphens (e.g., `black-knight-sword.md`)
- IDs/References: lowercase with hyphens
- Display names: Proper case as appears in game