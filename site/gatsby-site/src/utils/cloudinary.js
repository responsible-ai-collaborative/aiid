import React, { useState, useEffect, useRef } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);

  const [loadFailed, setLoadFailed] = useState(!publicID || publicID.includes('placeholder.svg'));

  const [isPlaceholderLoaded, setIsPlaceholderLoaded] = useState(false);

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

  useEffect(() => {
    onImageLoaded(loadFailed);
  }, [loadFailed, onImageLoaded]);

  // Prepare Cloudinary image for AdvancedImage
  const image = new CloudinaryImage(publicID, { cloudName: config.cloudinary.cloudName });

  const tmpImage = new CloudinaryImage();

  tmpImage.delivery(format(auto())).delivery(quality(qAuto()));
  if (transformation) tmpImage.addTransformation(transformation);
  image.transformation = tmpImage.transformation.toString();

  const showSkeleton =
    !isLoaded &&
    !loadFailed &&
    publicID &&
    !publicID.includes('placeholder.svg') &&
    !isPlaceholderLoaded;

  if (publicID.includes('legacy/d41d8cd98f00b204e9800998ecf8427e')) {
    console.log('showSkeleton', showSkeleton, isLoaded, loadFailed, isPlaceholderLoaded, publicID);
  }

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
          // setIsLoaded(true);
          setIsPlaceholderLoaded(true);
        }}
        onError={() => {
          // setIsLoaded(true);
          setLoadFailed(true);
        }}
      />
      <AdvancedImage
        data-cy="cloudinary-image"
        alt={alt}
        className={`${className} ${
          !publicID || publicID === '' || loadFailed || showSkeleton ? 'hidden' : ''
        } h-full w-full object-cover absolute inset-0`}
        cldImg={image}
        plugins={plugins}
        style={style}
        onError={() => {
          setIsLoaded(true);
          setLoadFailed(true);
        }}
        onLoad={() => {
          setIsLoaded(true);
          setLoadFailed(false);
        }}
      />
    </div>
  );
};

export { getCloudinaryPublicID, Image };
