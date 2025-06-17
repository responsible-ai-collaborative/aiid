import React, { useState, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';
import PlaceholderImage from 'components/PlaceholderImage';
import { Spinner } from 'flowbite-react';

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
}) => {
  const [imageHasLoaded, setImageHasLoaded] = useState(false);

  const [imageHasFailed, setImageHasFailed] = useState(false);

  const cloudName = config.cloudinary.cloudName;

  const cloudinaryUrl = publicID
    ? `https://res.cloudinary.com/${cloudName}/image/upload/${publicID}`
    : '';

  useEffect(() => {
    if (!publicID) {
      setImageHasFailed(true);
      return;
    }
    setImageHasLoaded(false);
    setImageHasFailed(false);

    const img = new window.Image();

    img.onload = () => setImageHasLoaded(true);
    img.onerror = () => setImageHasFailed(true);
    img.src = cloudinaryUrl;
  }, [cloudinaryUrl, publicID]);

  const image = new CloudinaryImage(publicID, { cloudName });

  //TODO: this is a fix for this issue: https://github.com/PartnershipOnAI/aiid/issues/260
  // Setting transformation as a string skips the safe url check here: https://github.com/cloudinary/js-url-gen/blob/9a3d0a29ea77ddfd6f7181251615f34c2d8a6c5d/src/assets/CloudinaryFile.ts#L279
  const tmpImage = new CloudinaryImage();

  tmpImage.delivery(format(auto())).delivery(quality(qAuto()));
  if (transformation) tmpImage.addTransformation(transformation);
  image.transformation = tmpImage.transformation.toString();

  return (
    <div data-cy="cloudinary-image-wrapper" className={`h-full w-full aspect-[16/9]`}>
      {/* Only show AdvancedImage if report's image preloaded successfully */}
      {imageHasLoaded && (
        <AdvancedImage
          data-cy={'cloudinary-image'}
          alt={alt}
          className={`${className} h-full w-full object-cover`}
          cldImg={image}
          plugins={plugins}
          style={style}
        />
      )}
      {/* Only show placeholder if report image failed to load */}
      {!imageHasLoaded && imageHasFailed && (
        <PlaceholderImage
          siteName="IncidentDatabase.AI"
          itemIdentifier={itemIdentifier}
          title={alt}
          className={`${className} h-full w-full object-cover`}
          height={height}
          style={style}
          data-cy="cloudinary-image-placeholder"
        />
      )}
      {/* Show spinner while loading, so no broken image is displayed */}
      {!imageHasLoaded && !imageHasFailed && (
        <div className="flex justify-center items-center h-full w-full">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export { getCloudinaryPublicID, Image };
