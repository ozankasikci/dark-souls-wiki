class SearchUI {
    constructor() {
        this.searchContainer = null;
        this.searchInput = null;
        this.searchResults = null;
        this.searchOverlay = null;
        this.debounceTimer = null;
    }

    initialize() {
        this.createSearchElements();
        this.attachEventListeners();
        this.addKeyboardShortcuts();
    }

    createSearchElements() {
        // Create search button for navigation
        const navMenu = document.querySelector('.nav-menu');
        const searchNavItem = document.createElement('li');
        searchNavItem.innerHTML = '<a href="#" id="search-trigger">Search</a>';
        navMenu.appendChild(searchNavItem);

        // Create search overlay
        this.searchOverlay = document.createElement('div');
        this.searchOverlay.className = 'search-overlay';
        this.searchOverlay.innerHTML = `
            <div class="search-modal">
                <div class="search-header">
                    <input type="text" id="search-input" placeholder="Search Dark Souls Wiki..." autocomplete="off">
                    <button class="search-close" aria-label="Close search">&times;</button>
                </div>
                <div class="search-results-container">
                    <div id="search-results"></div>
                </div>
            </div>
        `;
        document.body.appendChild(this.searchOverlay);

        // Get references to elements
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
    }

    attachEventListeners() {
        // Search trigger
        document.getElementById('search-trigger').addEventListener('click', (e) => {
            e.preventDefault();
            this.openSearch();
        });

        // Close button
        document.querySelector('.search-close').addEventListener('click', () => {
            this.closeSearch();
        });

        // Click outside to close
        this.searchOverlay.addEventListener('click', (e) => {
            if (e.target === this.searchOverlay) {
                this.closeSearch();
            }
        });

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Prevent form submission on enter
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Navigate to first result if available
                const firstResult = this.searchResults.querySelector('.search-result');
                if (firstResult) {
                    const link = firstResult.querySelector('a');
                    if (link) {
                        window.location.href = link.href;
                        this.closeSearch();
                    }
                }
            }
        });
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K or Cmd+K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            // Escape to close search
            if (e.key === 'Escape' && this.searchOverlay.classList.contains('active')) {
                this.closeSearch();
            }
        });
    }

    openSearch() {
        this.searchOverlay.classList.add('active');
        this.searchInput.focus();
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    closeSearch() {
        this.searchOverlay.classList.remove('active');
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
        document.body.style.overflow = ''; // Restore scrolling
    }

    handleSearch(query) {
        // Clear previous timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Debounce search
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    async performSearch(query) {
        if (!query || query.trim().length === 0) {
            this.searchResults.innerHTML = '';
            return;
        }

        // Show loading state
        this.searchResults.innerHTML = '<div class="search-loading">Searching...</div>';

        try {
            // Ensure search engine is initialized
            if (!searchEngine.initialized) {
                await searchEngine.initialize();
            }

            // Perform search
            const results = await searchEngine.searchWithHighlight(query, 10);

            if (results.length === 0) {
                this.searchResults.innerHTML = `
                    <div class="search-no-results">
                        No results found for "<strong>${this.escapeHtml(query)}</strong>"
                    </div>
                `;
                return;
            }

            // Display results
            this.displayResults(results, query);
        } catch (error) {
            console.error('Search error:', error);
            this.searchResults.innerHTML = '<div class="search-error">An error occurred while searching.</div>';
        }
    }

    displayResults(results, query) {
        const resultsHtml = results.map(result => `
            <div class="search-result">
                <a href="${result.url}">
                    <div class="search-result-header">
                        <h4>${result.highlightedTitle}</h4>
                        <span class="search-result-category">${result.category}</span>
                    </div>
                    <p class="search-result-excerpt">${result.excerpt}</p>
                </a>
            </div>
        `).join('');

        this.searchResults.innerHTML = `
            <div class="search-results-header">
                Found ${results.length} result${results.length !== 1 ? 's' : ''} for "<strong>${this.escapeHtml(query)}</strong>"
            </div>
            ${resultsHtml}
        `;

        // Add click handlers to close search on result click
        this.searchResults.querySelectorAll('.search-result a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeSearch();
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize search UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const searchUI = new SearchUI();
    searchUI.initialize();
});