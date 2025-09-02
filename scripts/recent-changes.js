// Recent Changes Tracker
// This script fetches recent commits from GitHub to show wiki activity

class RecentChanges {
    constructor() {
        this.githubRepo = 'ozankasikci/dark-souls-wiki';
        this.apiUrl = `https://api.github.com/repos/${this.githubRepo}/commits`;
        this.maxItems = 20;
    }

    async fetchRecentChanges() {
        try {
            const response = await fetch(`${this.apiUrl}?per_page=${this.maxItems}`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const commits = await response.json();
            return this.processCommits(commits);
        } catch (error) {
            console.error('Error fetching recent changes:', error);
            return this.getFallbackChanges();
        }
    }

    processCommits(commits) {
        return commits.map(commit => {
            const files = commit.files || [];
            const changes = this.categorizeChanges(files);
            
            return {
                sha: commit.sha.substring(0, 7),
                message: commit.commit.message,
                author: commit.commit.author.name,
                authorAvatar: commit.author?.avatar_url || '',
                date: new Date(commit.commit.author.date),
                url: commit.html_url,
                changes: changes,
                additions: commit.stats?.additions || 0,
                deletions: commit.stats?.deletions || 0
            };
        });
    }

    categorizeChanges(files) {
        const categories = {
            bosses: [],
            areas: [],
            equipment: [],
            npcs: [],
            items: [],
            other: []
        };

        files.forEach(file => {
            const path = file.filename;
            
            if (path.startsWith('data/bosses/')) {
                categories.bosses.push(this.extractFileName(path));
            } else if (path.startsWith('data/areas/')) {
                categories.areas.push(this.extractFileName(path));
            } else if (path.startsWith('data/equipment/')) {
                categories.equipment.push(this.extractFileName(path));
            } else if (path.startsWith('data/npcs/')) {
                categories.npcs.push(this.extractFileName(path));
            } else if (path.startsWith('data/items/')) {
                categories.items.push(this.extractFileName(path));
            } else {
                categories.other.push(path);
            }
        });

        return categories;
    }

    extractFileName(path) {
        const parts = path.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.md', '').replace(/-/g, ' ');
    }

    getFallbackChanges() {
        // Return example changes if API fails
        return [
            {
                sha: 'example1',
                message: 'Updated Ornstein and Smough strategy',
                author: 'Contributor',
                date: new Date(),
                changes: { bosses: ['Ornstein and Smough'] },
                additions: 45,
                deletions: 12
            },
            {
                sha: 'example2',
                message: 'Added missing NPC dialogue',
                author: 'WikiEditor',
                date: new Date(Date.now() - 86400000),
                changes: { npcs: ['Solaire of Astora'] },
                additions: 23,
                deletions: 0
            }
        ];
    }

    renderChanges(changes) {
        const container = document.getElementById('recent-changes-list');
        if (!container) return;

        const html = changes.map(change => this.renderChangeItem(change)).join('');
        container.innerHTML = html;
    }

    renderChangeItem(change) {
        const timeAgo = this.getTimeAgo(change.date);
        const changesSummary = this.getChangesSummary(change.changes);
        
        return `
            <div class="change-item">
                <div class="change-header">
                    <div class="change-author">
                        ${change.authorAvatar ? 
                            `<img src="${change.authorAvatar}" alt="${change.author}" class="author-avatar">` : 
                            `<div class="author-avatar-placeholder"></div>`
                        }
                        <span class="author-name">${change.author}</span>
                    </div>
                    <time class="change-time" datetime="${change.date.toISOString()}">
                        ${timeAgo}
                    </time>
                </div>
                
                <div class="change-content">
                    <h4 class="change-message">
                        ${change.url ? 
                            `<a href="${change.url}" target="_blank">${change.message}</a>` :
                            change.message
                        }
                    </h4>
                    
                    ${changesSummary ? `
                        <div class="change-summary">
                            ${changesSummary}
                        </div>
                    ` : ''}
                    
                    <div class="change-stats">
                        <span class="additions">+${change.additions}</span>
                        <span class="deletions">-${change.deletions}</span>
                        <span class="commit-sha">${change.sha}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getChangesSummary(changes) {
        const parts = [];
        
        if (changes.bosses.length > 0) {
            parts.push(`Bosses: ${changes.bosses.join(', ')}`);
        }
        if (changes.areas.length > 0) {
            parts.push(`Areas: ${changes.areas.join(', ')}`);
        }
        if (changes.equipment.length > 0) {
            parts.push(`Equipment: ${changes.equipment.join(', ')}`);
        }
        if (changes.npcs.length > 0) {
            parts.push(`NPCs: ${changes.npcs.join(', ')}`);
        }
        if (changes.items.length > 0) {
            parts.push(`Items: ${changes.items.join(', ')}`);
        }
        
        return parts.join(' • ');
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        
        return 'just now';
    }

    async createRecentChangesPage() {
        const html = `
            <div class="recent-changes-page">
                <header class="content-header">
                    <h1>Recent Changes</h1>
                    <p class="content-description">
                        Track the latest updates and contributions to the Dark Souls Wiki
                    </p>
                </header>
                
                <div class="changes-filters">
                    <button class="filter-btn active" data-filter="all">All Changes</button>
                    <button class="filter-btn" data-filter="bosses">Bosses</button>
                    <button class="filter-btn" data-filter="areas">Areas</button>
                    <button class="filter-btn" data-filter="equipment">Equipment</button>
                    <button class="filter-btn" data-filter="npcs">NPCs</button>
                </div>
                
                <div class="changes-container">
                    <div id="recent-changes-list" class="changes-list">
                        <div class="loading">Loading recent changes...</div>
                    </div>
                </div>
                
                <div class="changes-footer">
                    <a href="https://github.com/${this.githubRepo}/commits/main" target="_blank" class="view-all-link">
                        View all commits on GitHub →
                    </a>
                </div>
            </div>
        `;
        
        return html;
    }

    attachFilterHandlers() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterChanges(filter);
                
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    filterChanges(category) {
        const items = document.querySelectorAll('.change-item');
        items.forEach(item => {
            if (category === 'all') {
                item.style.display = 'block';
            } else {
                // Check if item contains changes for this category
                const summary = item.querySelector('.change-summary');
                if (summary && summary.textContent.toLowerCase().includes(category)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    }
}

// Export for use in router
window.RecentChanges = RecentChanges;