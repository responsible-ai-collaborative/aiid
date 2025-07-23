# Cloudinary Integration

## About Cloudinary

[Cloudinary](https://cloudinary.com/) is an **In-Kind Sponsor** of the AI Incident Database, providing powerful image and video management services that enhance our platform's capabilities.

### Why Cloudinary is Essential for AIID

Cloudinary provides AIID with:

- **Automatic Image Optimization**: Images are automatically optimized for different devices and screen sizes
- **Global CDN**: Fast image delivery worldwide through Cloudinary's global content delivery network
- **Transformations**: On-the-fly image resizing, cropping, and format conversion
- **Fetch Remote Images**: Ability to fetch and cache images from external sources
- **Reliable Infrastructure**: Enterprise-grade reliability and uptime for our image assets

## Configuration

### Default Setup (Sponsored)

AIID uses Cloudinary's sponsored cloud by default. No additional configuration is required.

### Custom Cloud Setup

If you want to use your own Cloudinary cloud, update the configuration in `gatsby-site/config.js`:

```javascript
cloudinary: { 
  cloudName: 'your-cloud-name' 
}
```

## How AIID Uses Cloudinary

### 1. Image Fetching

AIID uses Cloudinary's **fetch** delivery type to retrieve and cache images from external sources:

```javascript
// Example: Fetching remote images for incident reports
const image = new CloudinaryImage(url, { cloudName: config.cloudinary.cloudName })
  .setDeliveryType('fetch');
```

### 2. Image Optimization

All images are automatically optimized with:
- **Format optimization** (`f_auto`) - Automatically serves WebP, AVIF, or other modern formats when supported
- **Quality optimization** (`q_auto`) - Intelligent quality settings for optimal file size
- **Responsive images** - Different sizes for different screen sizes

### 3. Image Components

AIID provides reusable image components that leverage Cloudinary's capabilities:

```javascript
import { Image } from 'utils/cloudinary';

<Image
  publicID={imageUrl}
  alt="Incident image"
  height={300}
  className="rounded-lg"
/>
```

### 4. Fallback Handling

The system includes robust fallback mechanisms:
- **Loading [skeletons](../gatsby-site/src/elements/Skeletons/Image/index.js)** while images load
- **[Placeholder images](../gatsby-site/src/components/PlaceholderImage.js)** when external images fail to load
- **Error handling** for inaccessible or blocked images

#### PlaceholderImage Component

When external images fail to load (due to server restrictions, network issues, or invalid URLs), AIID generates unique, visually appealing placeholder images using the `PlaceholderImage` component:

```javascript
import PlaceholderImage from 'components/PlaceholderImage';

<PlaceholderImage
  siteName="IncidentDatabase.AI"
  itemIdentifier="image_url"
  title="Incident Title"
  height={300}
  onLoad={() => console.log('Placeholder loaded')}
  onError={() => console.log('Placeholder failed')}
/>
```

**Features:**
- **Deterministic Generation**: Creates consistent placeholder images based on the `itemIdentifier` or `title`
- **Branded Content**: Displays "IncidentDatabase.AI" prominently in the placeholder
- **Color Schemes**: Uses randomized but consistent color palettes (cyberpunk, matrix, sunset, etc.)
- **Responsive Design**: Automatically scales to different sizes while maintaining aspect ratio
- **Canvas-based**: Generates images using HTML5 Canvas for optimal performance

## Common Use Cases

### Incident Report Images
- Fetch and display images from news articles and reports
- Automatic optimization for different viewing contexts
- Fallback to placeholder images when external sources are unavailable

### User-Submitted Content
- Preview images during submission process
- Validate image accessibility before processing
- Provide immediate feedback on image loading status

## Troubleshooting

### Image Loading Issues

If images fail to load, this may be due to:
- **Invalid URLs**: Check that the image URL is accessible in a browser
- **Server restrictions**: Some image hosts block external requests
- **Network issues**: Temporary connectivity problems

### Solutions
- Verify the image URL works in a browser
- Try uploading the image directly to Cloudinary instead of fetching
- Use a different image host that allows external access