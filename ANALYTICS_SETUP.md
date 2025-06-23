# Google Analytics Setup

This website includes Google Analytics 4 (GA4) tracking. Follow these steps to enable analytics:

## 1. Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Set up your account:
   - Account name: "Dark Souls Wiki"
   - Data sharing settings: Choose your preferences

## 2. Create a Property

1. Property name: "Dark Souls Wiki"
2. Reporting time zone: Choose your timezone
3. Currency: Choose your currency
4. Industry category: "Games"
5. Business size: Choose appropriate size

## 3. Set up Data Stream

1. Choose "Web" platform
2. Website URL: Enter your Vercel domain (e.g., `https://your-site.vercel.app`)
3. Stream name: "Dark Souls Wiki - Web"

## 4. Get Your Measurement ID

After creating the data stream, you'll see a **Measurement ID** that looks like: `G-XXXXXXXXXX`

## 5. Configure the Website

1. Open `/scripts/analytics.js`
2. Find the line: `this.measurementId = 'GA_MEASUREMENT_ID';`
3. Replace `GA_MEASUREMENT_ID` with your actual measurement ID:
   ```javascript
   this.measurementId = 'G-XXXXXXXXXX'; // Your actual ID
   ```
4. Save the file
5. Commit and push to deploy

## Features Tracked

The analytics system automatically tracks:

- **Page Views**: Every page/section visited
- **Navigation**: Movement between sections (Equipment, Items, etc.)
- **Search Queries**: What users search for
- **Content Views**: Individual items/equipment viewed

## Testing

1. After deployment, visit your website
2. Go to Google Analytics → Reports → Realtime
3. You should see your visit appear within a few minutes

## Privacy Compliance

The analytics implementation:
- Uses Google Analytics 4 (GDPR compliant)
- Only tracks page views and interactions
- No personal data is collected beyond standard GA4 metrics
- Users can block tracking with browser settings/extensions

## Troubleshooting

- **No data appearing**: Check that the Measurement ID is correct
- **Real-time not showing**: Allow 24-48 hours for full data processing
- **Console errors**: Ensure the Measurement ID format is correct (G-XXXXXXXXXX)