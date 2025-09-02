# Contributing to Dark Souls Wiki

Thank you for your interest in contributing to the Dark Souls Wiki! This collaborative project aims to provide comprehensive, accurate information about Dark Souls Remastered.

## How to Contribute

### Method 1: Quick Edits (Recommended for Small Changes)

1. **Find the page you want to edit**
2. **Click "Improve this page"** button at the bottom of any content page
3. **Edit the Markdown file** directly on GitHub
4. **Submit a Pull Request** with your changes
5. **Wait for review** - Your changes will be reviewed and merged

### Method 2: Using GitHub Issues

1. **Click "Report issue"** on any page
2. **Describe the problem** or suggestion
3. **Submit the issue** for discussion

### Method 3: Discussion & Suggestions

- Use the **comment section** at the bottom of each page
- Share tips, strategies, and additional information
- Help other players with questions

## Content Guidelines

### Writing Style
- **Be clear and concise** - Avoid unnecessary jargon
- **Use proper grammar** and spelling
- **Stay objective** - Present facts, not opinions (except in strategy sections)
- **Include sources** when adding lore information

### Content Standards
- **Accuracy is paramount** - Verify information before submitting
- **No spoilers in descriptions** - Use spoiler tags for major plot points
- **Respect all playstyles** - Don't dismiss builds or strategies
- **Keep it relevant** - Stay focused on Dark Souls Remastered

### Formatting
- Use **Markdown** for all content
- Follow existing templates for consistency
- Include metadata in frontmatter (YAML format)
- Use descriptive commit messages

## What We're Looking For

### High Priority
- **Missing boss strategies**
- **Weapon scaling data**
- **NPC questline details**
- **Item locations**
- **Lore connections**

### Always Welcome
- **Grammar and spelling fixes**
- **Clarifications and corrections**
- **Additional tips and strategies**
- **Better descriptions**
- **Cross-references between pages**

## File Structure

```
data/
├── areas/          # Area guides
├── bosses/         # Boss strategies
├── builds/         # Character builds
├── equipment/      # Weapons, armor, items
├── npcs/           # NPC information
├── quests/         # Questlines
└── lore/           # Lore articles
```

## Metadata Format

Each content file should include frontmatter:

```yaml
---
name: Item Name
description: Brief description
category: weapon/armor/item/etc
stats:
  damage: 100
  scaling: "C/D/-/-"
location: Where to find
related:
  - other-item
  - related-npc
---
```

## Code of Conduct

### Be Respectful
- Treat all contributors with respect
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully

### Be Collaborative
- Work together to improve content
- Credit others for their contributions
- Ask for help when needed

### Be Patient
- Reviews may take time
- Not all contributions will be accepted
- Focus on improving the wiki together

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dark-souls-wiki.git
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b add-boss-strategy
   ```
4. **Make your changes** and test locally
5. **Commit with a clear message**:
   ```bash
   git commit -m "Add strategy for Ornstein and Smough"
   ```
6. **Push to your fork**:
   ```bash
   git push origin add-boss-strategy
   ```
7. **Open a Pull Request** on GitHub

## Testing Locally

Run a local server to test your changes:

```bash
# Using Python
python -m http.server 8888

# Using Node.js
npx http-server -p 8888
```

Then visit `http://localhost:8888` in your browser.

## Questions?

- Open an issue on GitHub
- Join the discussion in comments
- Check existing issues and PRs first

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

---

**Praise the Sun!** \\[T]/