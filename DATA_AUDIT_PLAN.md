# Dark Souls Wiki Data Accuracy Audit Plan

## Problem
User reported inaccurate data throughout the wiki. Example: Cleansing Greatshield incorrectly listed in "Great Hollow" instead of "Chasm of the Abyss", with wrong description text (Havel's Greatshield description used instead).

## Scope
Full systematic audit of all 330+ data files across 12 categories.

---

## Phase 1: Shields (48 files)

### 1.1 Greatshields
Files to audit:
- `data/equipment/shields/greatshields/cleansing-greatshield.md` (PRIORITY - reported error)
- `data/equipment/shields/greatshields/black-iron-greatshield.md`
- `data/equipment/shields/greatshields/bonewheel-shield.md`
- `data/equipment/shields/greatshields/giant-shield.md`
- `data/equipment/shields/greatshields/greatshield-of-artorias.md`
- `data/equipment/shields/greatshields/havels-greatshield.md`
- `data/equipment/shields/greatshields/stone-greatshield.md`
- `data/equipment/shields/greatshields/tower-shield.md`

Verify for each:
- [ ] Location matches actual in-game location
- [ ] Description is correct item's description (not copy-pasted from another)
- [ ] Stats (Physical/Magic/Fire/Lightning Defense, Stability, Weight)
- [ ] Requirements (Strength, Faith if applicable)
- [ ] Special properties

### 1.2 Small Shields (11 files)
- `data/equipment/shields/small-shields/*.md`

### 1.3 Medium Shields
- `data/equipment/shields/medium-shields/*.md`

### 1.4 Unique Shields
- `data/equipment/shields/unique-shields/*.md`

---

## Phase 2: Weapons (121 files)

### 2.1 Priority - Unique/Named Weapons
Boss soul weapons and unique drops first (most likely to have specific location errors):
- Black Knight weapons
- Demon weapons
- Dragon weapons
- Boss soul weapons (Quelaag's Furysword, Moonlight Greatsword, etc.)

### 2.2 By Category
- Daggers (7 files)
- Straight Swords (13 files)
- Greatswords
- Ultra Greatswords
- Curved Swords
- Curved Greatswords
- Piercing Swords
- Katanas
- Axes
- Great Axes
- Hammers
- Great Hammers
- Fist Weapons
- Spears
- Halberds
- Whips
- Bows
- Crossbows
- Catalysts
- Talismans
- Flames

---

## Phase 3: Armor (40 files)

### 3.1 Priority - Unique Sets
- Black Iron Set
- Havel's Set
- Ornstein's Set
- Smough's Set
- Artorias's Set
- Knight Artorias Set
- Ciaran's Set
- Giant's Set

### 3.2 By Category
- Starting Sets
- Light Armor
- Medium Armor
- Heavy Armor
- Unique Armor

---

## Phase 4: Rings (26 files)

- Offensive Rings
- Defensive Rings
- Utility Rings
- Resistance Rings

Key rings to verify:
- Havel's Ring
- Ring of Favor and Protection
- Covenant rings (Darkmoon, Cat, etc.)
- DLC rings (Artorias of the Abyss content)

---

## Phase 5: Items (33 files)

- Consumables (Estus Flask, Divine Blessing, etc.)
- Embers
- Keys
- Ore (Titanite materials)
- Souls
- Tools
- Multiplayer items

---

## Phase 6: NPCs (10+ files)

- Verify encounter locations
- Quest progression steps
- Items sold/dropped
- Covenant affiliations

Priority NPCs:
- Solaire of Astora
- Siegmeyer of Catarina
- Patches
- Frampt/Kaathe
- Quelana

---

## Phase 7: Areas (15 files)

- Verify connected areas
- Bonfire counts
- Boss encounters
- Notable item locations
- NPC spawn points

---

## Phase 8: Bosses (4+ files)

- HP values
- Soul rewards
- Weakness/resistance accuracy
- Drop tables
- Location descriptions

---

## Phase 9: Quests (3 files)

- Quest step accuracy
- Trigger conditions
- Failure conditions
- Rewards

---

## Phase 10: Builds (24 files)

- Verify all referenced equipment exists
- Check stat recommendations
- Validate upgrade paths

---

## Phase 11: Lore (4 files)

- Factual accuracy
- Source consistency

---

## Verification Sources

For each item, cross-reference with:
1. Fextralife Dark Souls Wiki (fextralife.com/darksouls)
2. Dark Souls Wikidot (darksouls.wikidot.com)
3. Web searches for specific item data

---

## Correction Process

For each file:
1. Read current content
2. Web search "[item name] dark souls wiki"
3. Compare location, stats, description
4. Note discrepancies
5. Edit file with correct data
6. Track changes made

---

## Verification After Completion

1. Run dev server: `npm run dev` (port 8888)
2. Browse corrected pages
3. Spot-check random items
4. Ensure no broken links or missing data

---

## Major Pattern Found: DS3 Content Mixed with DS1

Many files contain Dark Souls 3 information instead of Dark Souls 1. This appears to be a systematic data contamination issue.

---

## Corrections Made (Session 1)

### Shields Fixed (14 corrections)
| Item | Issue Fixed |
|------|-------------|
| Cleansing Greatshield | Wrong location (Great Hollow → Chasm of Abyss), wrong description |
| Eagle Shield | Completely wrong (said Solaire's shield, wrong stats, wrong location) |
| Tower Shield | Wrong location (said Andre sells it - he doesn't) |
| Havel's Greatshield | Wrong description ("Dragon Tooth" → "slab of stone"), durability |
| Black Iron Greatshield | Wrong description and location details |
| Greatshield of Artorias | Wrong Lightning Defense, improved description |
| Stone Greatshield | Wrong Magic Defense, Stability, Durability |
| Bonewheel Shield | Multiple wrong stats (defense, stability, durability) |
| Giant Shield | Wrong Lightning Defense, Stability, missing purchase location |
| Crystal Ring Shield | Wrong description ("four knights of Gwyn"), said can't be repaired |
| Effigy Shield | Wrong location details, wrong requirement type (STR → Faith) |
| Caduceus Round Shield | Wrong location (said sold by Griggs - wrong, found in graveyard) |

### Weapons Audited (24 files, 15 needed fixes)
| Item | Issue Fixed |
|------|-------------|
| Moonlight Greatsword | **MAJOR**: Had DS3 info (Soul of Oceiros), fixed to DS1 (Seath tail cut) |
| Priscilla's Dagger | Wrong acquisition (said boss soul, actually tail cut), wrong upgrade path |
| Longsword | **MAJOR**: Had DS3 info (High Wall of Lothric), fixed to DS1 |
| Black Knight Sword | **MAJOR**: Had DS3 info (weapon arts, DS3 areas), fixed to DS1 |
| Claymore | **MAJOR**: Had DS3 info (Irithyll, Stance weapon art), fixed to DS1 (Undead Burg bridge) |
| Zweihander | **MAJOR**: Had DS3 info (Greirat, Stomp), fixed to DS1 (Firelink graveyard) |
| Dragon Tooth | Wrong location (said Havel drops it, actually chest in Anor Londo) |
| Uchigatana | **MAJOR**: Had DS3 info (Sword Master, Hold weapon art), fixed to DS1 (Undead Merchant) |
| Chaos Blade | Wrong bleed value (300 → 360) |
| Dragonslayer Spear | Wrong Faith scaling (B → A) |
| Quelaag's Furysword | Verified correct |
| Black Knight Halberd | Verified correct |
| Grant | Fixed DS3 term ("FP" → "attunement slots") |
| Black Bow of Pharis | Wrong acquisition (said Pharis invades, she's a regular NPC; no human form needed) |
| Astora's Straight Sword | Minor fix ("infused" → DS1 terminology) |
| Dark Hand | Verified correct |
| Greatsword of Artorias | Verified correct |
| Abyss Greatsword | Verified correct |
| Gravelord Sword | Verified correct |
| Black Knight Greataxe | Verified correct |
| Demon's Greataxe | Verified correct |
| Halberd | Verified correct |

### Rings Audited (7 files, 4 needed fixes)
| Item | Issue Fixed |
|------|-------------|
| Havel's Ring | **MAJOR**: Wrong location (said Anor Londo, actually dropped by Havel in Undead Burg tower) |
| Dark Wood Grain Ring | Wrong location description (confusing, now clarified as Shiva's bodyguard drop) |
| Hornet Ring | **MAJOR**: Wrong location (said Undead Asylum + Peculiar Doll, actually Sif's arena in Darkroot Garden) |
| Leo Ring | Wrong acquisition (said "regardless of boss order", must kill Ornstein LAST) |
| Ring of Favor and Protection | Verified correct |
| Covenant of Artorias | Verified correct |
| Red Tearstone Ring | Verified correct |

---

## Remaining Work

### High Priority (Likely have DS3 contamination)
- All weapons referencing "weapon arts", "infusions", "FP"
- Any items mentioning DS3 areas (Lothric, Irithyll, etc.)
- Items with DS3 upgrade paths (Titanite Shards → Slab in 10 steps)

### Medium Priority
- Verify remaining weapon files
- Audit armor sets
- Audit rings

### Lower Priority
- NPCs, Areas, Bosses (likely more accurate)
- Builds (reference other items)
- Lore
