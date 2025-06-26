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
  const [loadFailed, setLoadFailed] = useState(!publicID || publicID.includes('placeholder.svg'));

  const [placeholderReady, setPlaceholderReady] = useState(false);

  const [imageReady, setImageReady] = useState(false);

  const [preflightChecked, setPreflightChecked] = useState(false);

  const prevPublicID = React.useRef(publicID);

  useEffect(() => {
    if (prevPublicID.current !== publicID) {
      setLoadFailed(false);
      setPlaceholderReady(false);
      setImageReady(false);
      setPreflightChecked(false);
      prevPublicID.current = publicID;
      if (publicID && publicID.includes('placeholder.svg')) {
        setLoadFailed(true);
        setPlaceholderReady(true);
        setPreflightChecked(true);
      }
    }
  }, [publicID]);

  useEffect(() => {
    onImageLoaded(loadFailed);
  }, [loadFailed, onImageLoaded]);

  const image = new CloudinaryImage(publicID, {
    cloudName: config.cloudinary.cloudName,
  });

  //TODO: this is a fix for this issue: https://github.com/PartnershipOnAI/aiid/issues/260
  // Setting transformation as a string skips the safe url check here: https://github.com/cloudinary/js-url-gen/blob/9a3d0a29ea77ddfd6f7181251615f34c2d8a6c5d/src/assets/CloudinaryFile.ts#L279
  const tmpImage = new CloudinaryImage();

  tmpImage.delivery(format(auto())).delivery(quality(qAuto()));

  if (transformation) {
    tmpImage.addTransformation(transformation);
  }

  image.transformation = tmpImage.transformation.toString();

  // --- Preflight check: hidden native <img> ---
  // Purpose: Work around delays in Cloudinary's AdvancedImage onLoad/onError events.
  // Mechanism: We create a native <img> in memory (not in the DOM) with the same Cloudinary URL.
  //            This allows us to immediately detect if the image is available or fails to load,
  //            regardless of Cloudinary SDK/plugin delays or lazy loading.
  //            As soon as the browser loads or errors the image, we update our state to hide the skeleton.
  //            This ensures the skeleton disappears as soon as possible, even if AdvancedImage is still processing.
  const cloudinaryUrl = image.toURL();

  useEffect(() => {
    // Only run if we have a URL and haven't already checked
    if (!cloudinaryUrl || preflightChecked) return;
    // Create a native <img> in memory
    const img = new window.Image();

    img.src = cloudinaryUrl;
    // If the image loads, mark as ready and not failed
    img.onload = () => {
      setImageReady((prev) => (prev ? prev : true));
      setLoadFailed((prev) => (prev ? false : prev));
      setPreflightChecked((prev) => (prev ? prev : true));
    };
    // If the image fails, mark as ready and failed
    img.onerror = () => {
      setImageReady((prev) => (prev ? prev : true));
      setLoadFailed((prev) => (prev ? prev : true));
      setPreflightChecked((prev) => (prev ? prev : true));
    };
    // Clean up event handlers on unmount
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [cloudinaryUrl, preflightChecked]);

  const showSkeleton = !placeholderReady && !imageReady;

  return (
    <div data-cy="cloudinary-image-wrapper" className={`h-full w-full aspect-[16/9]`}>
      {showSkeleton && (
        <ImageSkeleton
          className={`${className || ''} h-full w-full object-cover`}
          height={height}
          style={style}
          data-cy="cloudinary-image-skeleton"
        />
      )}
      <PlaceholderImage
        siteName="IncidentDatabase.AI"
        itemIdentifier={itemIdentifier}
        title={alt}
        className={`${className || ''} ${
          (!publicID || publicID == '' || loadFailed) && !showSkeleton ? '' : 'hidden'
        } h-full w-full object-cover`}
        height={height}
        style={style}
        data-cy="cloudinary-image-placeholder"
        onLoad={() => setPlaceholderReady((prev) => (prev ? prev : true))}
        onError={() => setPlaceholderReady((prev) => (prev ? prev : true))}
      />
      <AdvancedImage
        data-cy={'cloudinary-image'}
        alt={alt}
        className={`${className || ''} ${
          !publicID || publicID == '' || loadFailed || showSkeleton ? 'hidden' : ''
        } h-full w-full object-cover`}
        cldImg={image}
        plugins={plugins}
        style={style}
        onError={() => {
          setLoadFailed((prev) => (prev ? prev : true));
          setImageReady((prev) => (prev ? prev : true));
        }}
        onLoad={() => {
          setLoadFailed((prev) => (prev ? false : prev));
          setImageReady((prev) => (prev ? prev : true));
        }}
      />
    </div>
  );
};

export { getCloudinaryPublicID, Image };
