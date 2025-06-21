// Clear local storage cache to force reload images

console.log('Clearing image cache...');

// Clear local storage if it exists
if (typeof localStorage !== 'undefined') {
    localStorage.clear();
    console.log('✓ Local storage cleared');
}

// Clear session storage if it exists
if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
    console.log('✓ Session storage cleared');
}

// If running in browser, also clear the imageLoader cache
if (typeof imageLoader !== 'undefined' && imageLoader.imageCache) {
    imageLoader.imageCache.clear();
    console.log('✓ Image loader cache cleared');
}

console.log('✨ Cache cleared! Refresh the page to see updated images.');