// Google Analytics configuration and tracking functions
class Analytics {
    constructor() {
        // Replace with your actual GA4 Measurement ID
        this.measurementId = 'GA_MEASUREMENT_ID'; // e.g., 'G-XXXXXXXXXX'
        this.initialized = false;
        this.init();
    }

    init() {
        // Only initialize if we have a valid measurement ID
        if (this.measurementId && this.measurementId !== 'GA_MEASUREMENT_ID') {
            this.loadGoogleAnalytics();
            this.initialized = true;
        } else {
            console.log('Google Analytics: Measurement ID not configured');
        }
    }

    loadGoogleAnalytics() {
        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.measurementId);

        // Make gtag globally available
        window.gtag = gtag;
    }

    // Track page views (for SPA navigation)
    trackPageView(page_title, page_location) {
        if (!this.initialized || typeof gtag === 'undefined') return;
        
        gtag('config', this.measurementId, {
            page_title: page_title,
            page_location: page_location
        });
    }

    // Track custom events
    trackEvent(action, category = 'engagement', label = null, value = null) {
        if (!this.initialized || typeof gtag === 'undefined') return;

        const eventParams = {
            event_category: category,
            event_label: label,
            value: value
        };

        // Remove null values
        Object.keys(eventParams).forEach(key => {
            if (eventParams[key] === null) {
                delete eventParams[key];
            }
        });

        gtag('event', action, eventParams);
    }

    // Track search queries
    trackSearch(searchTerm) {
        this.trackEvent('search', 'site_search', searchTerm);
    }

    // Track navigation between sections
    trackNavigation(section, subsection = null) {
        const label = subsection ? `${section}/${subsection}` : section;
        this.trackEvent('navigation', 'site_navigation', label);
    }

    // Track item/equipment views
    trackContentView(contentType, itemName) {
        this.trackEvent('view_item', 'content', `${contentType}:${itemName}`);
    }
}

// Initialize analytics
const analytics = new Analytics();

// Make available globally
window.Analytics = analytics;