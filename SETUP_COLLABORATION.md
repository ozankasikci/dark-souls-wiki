# Setting Up Collaboration Features

This guide will help you enable the collaboration features for your Dark Souls Wiki.

## Prerequisites

- A GitHub account
- Your wiki hosted on GitHub Pages or similar service
- Basic knowledge of Git and GitHub

## Step 1: Fork or Clone the Repository

1. Fork this repository to your GitHub account
2. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dark-souls-wiki.git
   cd dark-souls-wiki
   ```

## Step 2: Configure GitHub Integration

### Update Repository Information

Edit the following files and replace `your-username/dark-souls-wiki` with your actual GitHub username and repository name:

1. **scripts/content-renderer.js** (line 666):
   ```javascript
   const githubRepo = 'your-username/dark-souls-wiki';
   ```

2. **scripts/recent-changes.js** (line 7):
   ```javascript
   this.githubRepo = 'your-username/dark-souls-wiki';
   ```

3. **index.html** (line 120):
   ```html
   <a href="https://github.com/your-username/dark-souls-wiki" target="_blank">GitHub</a>
   ```

## Step 3: Set Up Giscus Comments

Giscus uses GitHub Discussions to power comments on your wiki.

### Enable GitHub Discussions

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Features**
4. Check **Discussions**

### Configure Giscus

1. Visit [giscus.app](https://giscus.app)
2. Enter your repository URL
3. Choose the following settings:
   - **Page ↔️ Discussions Mapping**: `pathname`
   - **Discussion Category**: Create a category called "Wiki Comments"
   - **Features**: Enable reactions
   - **Theme**: `dark_dimmed`

4. Copy the generated configuration values
5. Update **scripts/router.js** (starting at line 632):
   ```javascript
   script.setAttribute('data-repo', 'your-username/dark-souls-wiki');
   script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // From giscus.app
   script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // From giscus.app
   ```

## Step 4: Set Up Decap CMS (Optional)

Decap CMS provides a user-friendly interface for editing content.

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Dark Souls Wiki CMS
   - **Homepage URL**: Your wiki URL
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
4. Save the Client ID and Client Secret

### Configure Decap CMS

Edit **admin/config.yml**:
```yaml
backend:
  name: github
  repo: your-username/dark-souls-wiki
  branch: main
  
site_url: https://your-wiki-url.com
display_url: https://your-wiki-url.com
```

### For Netlify Hosting

If using Netlify:
1. Go to Site Settings > Identity
2. Enable Identity service
3. Set registration to "Invite only"
4. Enable Git Gateway

### For GitHub Pages

For GitHub Pages, you'll need to use Netlify Identity service or set up your own OAuth provider.

## Step 5: Test Collaboration Features

### Test Edit Buttons
1. Navigate to any content page
2. Scroll to the bottom
3. Click "Improve this page"
4. Verify it opens the correct file on GitHub

### Test Comments
1. Navigate to any content page
2. Scroll to the comments section
3. Sign in with GitHub
4. Post a test comment

### Test Recent Changes
1. Navigate to **Contribute > Recent Changes**
2. Verify recent commits are displayed
3. Test the filter buttons

### Test CMS (if configured)
1. Navigate to `/admin`
2. Authenticate with GitHub
3. Try editing a piece of content
4. Save and verify changes

## Step 6: Customize Settings

### Modify Contribution Guidelines
Edit `CONTRIBUTING.md` to match your project's needs

### Adjust Permissions
- Set branch protection rules on GitHub
- Configure who can merge pull requests
- Set up CODEOWNERS file if needed

## Troubleshooting

### Comments Not Loading
- Verify GitHub Discussions is enabled
- Check repository is public
- Confirm Giscus configuration is correct

### Edit Button 404
- Verify repository name is correct
- Check file paths match your structure
- Ensure branch name is correct (main vs master)

### CMS Not Working
- Check OAuth app configuration
- Verify backend settings in config.yml
- Check browser console for errors

## Security Considerations

1. **Never commit sensitive data** like API keys or secrets
2. **Use environment variables** for sensitive configuration
3. **Enable branch protection** to prevent direct pushes to main
4. **Review all contributions** before merging
5. **Set up GitHub Actions** for automated checks

## Next Steps

1. Invite contributors to your repository
2. Create issues for needed content
3. Set up a Discord or discussion forum
4. Add contributor recognition section
5. Create content templates for consistency

## Support

For issues specific to:
- **Giscus**: Visit [giscus/giscus](https://github.com/giscus/giscus)
- **Decap CMS**: Visit [decaporg/decap-cms](https://github.com/decaporg/decap-cms)
- **This Wiki**: Open an issue in your repository

---

Remember to star the repository and acknowledge contributors! 🌟