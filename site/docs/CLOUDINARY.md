# Cloudinary Integration

[Cloudinary](https://cloudinary.com/) provides image and video management services for the platform.

## Benefits

Cloudinary provides AIID with:

- **Image Optimization**: Automatic optimization for different devices and screen sizes
- **Global CDN**: Fast worldwide image delivery
- **Transformations**: On-the-fly image resizing, cropping, and format conversion
- **Remote Image Fetching**: Fetch and cache images from external sources
- **Reliable Infrastructure**: Enterprise-grade reliability for image assets

## Configuration

AIID uses a pre-configured Cloudinary cloud by default. For custom setup, update `gatsby-site/config.js`:

```javascript
cloudinary: { 
  cloudName: 'your-cloud-name' 
}
```

## Usage

### 1. Image Fetching

AIID uses Cloudinary's **fetch** delivery type to retrieve and cache images from external sources:

```javascript
// Example: Fetching remote images for incident reports
const image = new CloudinaryImage(url, { cloudName: config.cloudinary.cloudName })
  .setDeliveryType('fetch');
```

### 2. Image Components

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

### Fallback Handling

- **Loading skeletons** while images load
- **Placeholder images** when external images fail
- **Error handling** for inaccessible images

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

- **Incident Report Images**: Fetch and display images from news articles
- **User-Submitted Content**: Preview images during submission process

## Troubleshooting

If images fail to load:
- Verify the image URL works in a browser
- Check for server restrictions blocking external requests
- Try uploading directly to Cloudinary instead of fetching