import React, { useState, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';
import PlaceholderImage from 'components/PlaceholderImage';
import ImageSkeleton from '../elements/Skeletons/Image';

const getCloudinaryPublicID = (url) => {
  // https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_files

  const publicID = 'reports/' + url.replace(/^https?:\/\//, '');

  return publicID;
};

const Image = ({
  publicID,
  className = '',
  alt,
  transformation = null,
  plugins = [lazyload()],
  style = null,
  height = 800,
  itemIdentifier,
  onImageLoaded = (_loadFailed) => {}, // eslint-disable-line no-unused-vars
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const [imageFailed, setImageFailed] = useState(false);

  const [placeholderLoaded, setPlaceholderLoaded] = useState(false);

  // Reset state when publicID changes
  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);
    setPlaceholderLoaded(false);
  }, [publicID]);

  // Prepare Cloudinary image for AdvancedImage
  const image = new CloudinaryImage(publicID, { cloudName: config.cloudinary.cloudName });

  const tmpImage = new CloudinaryImage();

  tmpImage.delivery(format(auto())).delivery(quality(qAuto()));
  if (transformation) tmpImage.addTransformation(transformation);
  image.transformation = tmpImage.transformation.toString();

  // Show skeleton until image loads or fails and placeholder is loaded
  const showSkeleton = !imageLoaded && (!imageFailed || (imageFailed && !placeholderLoaded));

  return (
    <div data-cy="cloudinary-image-wrapper" className="relative h-full w-full aspect-[16/9]">
      {showSkeleton && (
        <ImageSkeleton
          className={`${className} h-full w-full object-cover absolute inset-0`}
          height={height}
          style={style}
          data-cy="cloudinary-image-skeleton"
        />
      )}
      {imageFailed && (
        <PlaceholderImage
          siteName="IncidentDatabase.AI"
          itemIdentifier={itemIdentifier}
          title={alt}
          className={`${className} h-full w-full object-cover absolute inset-0`}
          height={height}
          style={style}
          data-cy="cloudinary-image-placeholder"
          onLoad={() => {
            setPlaceholderLoaded(true);
            onImageLoaded(true);
          }}
          onError={() => {
            setPlaceholderLoaded(false);
            onImageLoaded(true);
          }}
        />
      )}
      <AdvancedImage
        data-cy="cloudinary-image"
        alt={alt}
        className={`
          ${className}
          h-full w-full object-cover absolute inset-0
          transition-opacity duration-300
          ${imageLoaded && !imageFailed ? 'opacity-100' : 'opacity-0'}
        `}
        cldImg={image}
        plugins={plugins}
        style={{
          ...style,
          opacity: imageLoaded && !imageFailed ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
        onError={() => {
          setImageFailed(true);
          onImageLoaded(true);
        }}
        onLoad={() => {
          setImageLoaded(true);
          onImageLoaded(false);
        }}
      />
    </div>
  );
};

// Defensive CSS to hide broken images
if (typeof window !== 'undefined') {
  const styleId = 'cloudinary-hide-broken-img';

  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');

    style.id = styleId;
    style.innerHTML = `
      [data-cy="cloudinary-image-wrapper"] img:not([src]),
      [data-cy="cloudinary-image-wrapper"] img[src=""],
      [data-cy="cloudinary-image-wrapper"] img[src][src^="blob:"] {
        display: none !important;
      }
      [data-cy="cloudinary-image-wrapper"] img:invalid {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export { getCloudinaryPublicID, Image };
