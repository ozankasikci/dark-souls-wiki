// Script to fetch weapon images using the browser
// This should be run in the browser console on a page with MCP playwright tools available

async function fetchWeaponImage(weaponId, fextralifeName) {
    const url = `https://darksouls.wiki.fextralife.com/${fextralifeName}`;
    console.log(`Fetching ${weaponId} from ${url}`);
    
    // Navigate to the page
    await window.mcp__playwright__browser_navigate({ url });
    
    // Wait for page to load
    await window.mcp__playwright__browser_wait_for({ time: 2 });
    
    // Take a snapshot to find the image
    const snapshot = await window.mcp__playwright__browser_snapshot();
    
    // Look for image URLs in the snapshot
    const imageMatch = snapshot.match(/\/file\/Dark-Souls\/[^"'\s]+\.(png|jpg|jpeg|gif)/i);
    
    if (imageMatch) {
        const imageUrl = `https://darksouls.wiki.fextralife.com${imageMatch[0]}`;
        console.log(`✓ Found image for ${weaponId}: ${imageUrl}`);
        return { weaponId, imageUrl, success: true };
    } else {
        console.log(`✗ No image found for ${weaponId}`);
        return { weaponId, success: false };
    }
}

// Map of weapon IDs to Fextralife URLs
const weaponUrlMap = {
    // Test with a few weapons first
    'dagger': 'Dagger',
    'club': 'Club',
    'zweihander': 'Zweihander',
    'uchigatana': 'Uchigatana',
    'claymore': 'Claymore'
};

// Function to fetch all weapon images
async function fetchAllWeaponImages() {
    const results = [];
    
    for (const [weaponId, fextralifeName] of Object.entries(weaponUrlMap)) {
        const result = await fetchWeaponImage(weaponId, fextralifeName);
        results.push(result);
        
        // Add delay between requests
        await window.mcp__playwright__browser_wait_for({ time: 1 });
    }
    
    // Summary
    const successful = results.filter(r => r.success);
    console.log('\n=== Summary ===');
    console.log(`Total weapons: ${results.length}`);
    console.log(`Successful: ${successful.length}`);
    console.log('\nSuccessful URLs:');
    successful.forEach(s => console.log(`${s.weaponId}: ${s.imageUrl}`));
    
    return results;
}

// Instructions for use:
console.log('To fetch weapon images, run: fetchAllWeaponImages()');
console.log('This will use the browser to navigate to each weapon page and find the image URL.');