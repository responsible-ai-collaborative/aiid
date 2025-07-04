import React, { useState, useEffect, useRef } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';
import PlaceholderImage from 'components/PlaceholderImage';
import ImageSkeleton from '../elements/Skeletons/Image';

// Utility to get Cloudinary public ID from a URL
const getCloudinaryPublicID = (url) => {
  // https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_files
  return 'reports/' + url.replace(/^https?:\/\//, '');
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
  // State for image loading and error
  const [isLoaded, setIsLoaded] = useState(false);

  const [loadFailed, setLoadFailed] = useState(!publicID || publicID.includes('placeholder.svg'));

  const [isPlaceholderLoaded, setIsPlaceholderLoaded] = useState(false);

  // Track previous publicID to reset state on change
  const prevPublicID = useRef(publicID);

  useEffect(() => {
    if (prevPublicID.current !== publicID) {
      setIsLoaded(false);
      setLoadFailed(!publicID || publicID.includes('placeholder.svg'));
      prevPublicID.current = publicID;
    }
  }, [publicID]);

  // Preflight check: only for non-placeholder images, only when not loaded/failed
  useEffect(() => {
    if (!publicID || publicID.includes('placeholder.svg') || isLoaded || loadFailed) return;

    const image = new CloudinaryImage(publicID, { cloudName: config.cloudinary.cloudName });

    image.delivery(format(auto())).delivery(quality(qAuto()));
    const url = image.toURL();

    let cancelled = false;

    const img = new window.Image();

    img.src = url;
    img.onload = () => {
      if (!cancelled) {
        setIsLoaded(true);
        setLoadFailed(false);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setIsLoaded(true);
        setLoadFailed(true);
      }
    };
    return () => {
      cancelled = true;
    };
  }, [publicID, isLoaded, loadFailed]);

  // Notify parent when image load fails
  useEffect(() => {
    onImageLoaded(loadFailed);
  }, [loadFailed, onImageLoaded]);

  // Prepare Cloudinary image for AdvancedImage
  const image = new CloudinaryImage(publicID, { cloudName: config.cloudinary.cloudName });

  const tmpImage = new CloudinaryImage();

  tmpImage.delivery(format(auto())).delivery(quality(qAuto()));
  if (transformation) tmpImage.addTransformation(transformation);
  image.transformation = tmpImage.transformation.toString();

  // Show skeleton if image is loading and not failed/placeholder
  const showSkeleton =
    !isLoaded &&
    !loadFailed &&
    publicID &&
    !publicID.includes('placeholder.svg') &&
    !isPlaceholderLoaded;

  return (
    <div data-cy="cloudinary-image-wrapper" className="relative h-full w-full aspect-[16/9]">
      <ImageSkeleton
        className={`${className} h-full w-full object-cover absolute inset-0`}
        height={height}
        style={style}
        data-cy="cloudinary-image-skeleton"
      />
      <PlaceholderImage
        siteName="IncidentDatabase.AI"
        itemIdentifier={itemIdentifier}
        title={alt}
        className={`${className} ${
          (!publicID || publicID === '' || loadFailed) && !showSkeleton ? '' : 'hidden'
        } h-full w-full object-cover absolute inset-0`}
        height={height}
        style={style}
        data-cy="cloudinary-image-placeholder"
        onLoad={() => {
          setIsPlaceholderLoaded(true);
        }}
        onError={() => {
          setLoadFailed(true);
        }}
      />
      {isLoaded && !loadFailed && publicID && publicID !== '' && (
        <AdvancedImage
          data-cy="cloudinary-image"
          alt={alt}
          className={`${className} h-full w-full object-cover absolute inset-0`}
          cldImg={image}
          plugins={plugins}
          style={style}
        />
      )}
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
