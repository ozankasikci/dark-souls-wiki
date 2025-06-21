class SearchEngine {
    constructor() {
        this.searchIndex = new Map();
        this.allContent = [];
        this.categories = ['weapons', 'items', 'bosses', 'areas', 'npcs', 'quests', 'lore'];
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            await this.buildSearchIndex();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize search index:', error);
        }
    }

    async buildSearchIndex() {
        const loadPromises = [];
        
        for (const category of this.categories) {
            const items = contentLoader.getKnownItemsForCategory(category);
            
            for (const itemId of items) {
                loadPromises.push(
                    contentLoader.loadContent(category, itemId)
                        .then(content => {
                            if (content) {
                                const searchEntry = {
                                    id: itemId,
                                    category: category,
                                    title: content.metadata.name || content.metadata.title || itemId,
                                    description: content.metadata.description || '',
                                    content: content.content,
                                    tags: content.metadata.tags || [],
                                    url: `#${category}/${itemId}`
                                };
                                
                                this.allContent.push(searchEntry);
                                this.indexContent(searchEntry);
                            }
                        })
                        .catch(err => console.error(`Failed to index ${category}/${itemId}:`, err))
                );
            }
        }
        
        await Promise.all(loadPromises);
    }

    indexContent(entry) {
        // Index by title words
        const titleWords = this.tokenize(entry.title);
        titleWords.forEach(word => {
            this.addToIndex(word, entry, 3); // Higher weight for title matches
        });
        
        // Index by description words
        const descWords = this.tokenize(entry.description);
        descWords.forEach(word => {
            this.addToIndex(word, entry, 2); // Medium weight for description
        });
        
        // Index by content words
        const contentWords = this.tokenize(entry.content);
        contentWords.forEach(word => {
            this.addToIndex(word, entry, 1); // Lower weight for content
        });
        
        // Index by tags
        entry.tags.forEach(tag => {
            this.addToIndex(tag.toLowerCase(), entry, 2);
        });
        
        // Index by category
        this.addToIndex(entry.category, entry, 2);
    }

    addToIndex(word, entry, weight = 1) {
        if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, new Map());
        }
        
        const wordIndex = this.searchIndex.get(word);
        if (!wordIndex.has(entry.id)) {
            wordIndex.set(entry.id, { entry, score: 0 });
        }
        
        wordIndex.get(entry.id).score += weight;
    }

    tokenize(text) {
        if (!text) return [];
        
        // Remove markdown formatting
        text = text.replace(/[#*_~`]/g, '');
        
        // Convert to lowercase and split by non-word characters
        return text.toLowerCase()
            .split(/\W+/)
            .filter(word => word.length > 2); // Filter out short words
    }

    search(query, limit = 20) {
        if (!query || query.trim().length === 0) return [];
        
        const queryWords = this.tokenize(query);
        const scores = new Map();
        
        // Calculate scores for each entry
        queryWords.forEach(word => {
            // Exact matches
            if (this.searchIndex.has(word)) {
                this.searchIndex.get(word).forEach((data, entryId) => {
                    if (!scores.has(entryId)) {
                        scores.set(entryId, { entry: data.entry, totalScore: 0 });
                    }
                    scores.get(entryId).totalScore += data.score;
                });
            }
            
            // Partial matches (prefix search)
            this.searchIndex.forEach((wordData, indexedWord) => {
                if (indexedWord.startsWith(word)) {
                    wordData.forEach((data, entryId) => {
                        if (!scores.has(entryId)) {
                            scores.set(entryId, { entry: data.entry, totalScore: 0 });
                        }
                        scores.get(entryId).totalScore += data.score * 0.5; // Lower weight for partial matches
                    });
                }
            });
        });
        
        // Sort by score and return top results
        const results = Array.from(scores.values())
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, limit)
            .map(item => item.entry);
        
        return results;
    }

    async searchWithHighlight(query, limit = 20) {
        const results = this.search(query, limit);
        const queryWords = this.tokenize(query);
        
        return results.map(result => {
            const highlightedResult = { ...result };
            
            // Highlight matches in title
            highlightedResult.highlightedTitle = this.highlightText(result.title, queryWords);
            
            // Create excerpt with highlighted matches
            highlightedResult.excerpt = this.createExcerpt(result.content, queryWords);
            
            return highlightedResult;
        });
    }

    highlightText(text, words) {
        let highlighted = text;
        
        words.forEach(word => {
            const regex = new RegExp(`\\b(${word}\\w*)\\b`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });
        
        return highlighted;
    }

    createExcerpt(content, words, maxLength = 150) {
        // Find the first occurrence of any query word
        let firstMatchIndex = content.length;
        let matchedWord = '';
        
        words.forEach(word => {
            const index = content.toLowerCase().indexOf(word.toLowerCase());
            if (index !== -1 && index < firstMatchIndex) {
                firstMatchIndex = index;
                matchedWord = word;
            }
        });
        
        // If no match found, return beginning of content
        if (firstMatchIndex === content.length) {
            return this.highlightText(content.substring(0, maxLength) + '...', words);
        }
        
        // Extract excerpt around the match
        const start = Math.max(0, firstMatchIndex - 50);
        const end = Math.min(content.length, firstMatchIndex + 100);
        let excerpt = content.substring(start, end);
        
        // Add ellipsis if needed
        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt = excerpt + '...';
        
        return this.highlightText(excerpt, words);
    }
}

// Create global search engine instance
const searchEngine = new SearchEngine();

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', () => {
    searchEngine.initialize();
});