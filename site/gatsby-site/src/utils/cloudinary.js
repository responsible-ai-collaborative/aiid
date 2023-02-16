import React, { useState, useRef, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';
import PlaceholderImage from 'components/PlaceholderImage';

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
  style,
  height = '800px',
  title,
  itemIdentifier,
}) => {
  const imageElement = useRef(null);

  const [loadFailed, setLoadFailed] = useState(!publicID || publicID == 'placeholder.svg');

  useEffect(() => {
    setLoadFailed(false);
    const img = imageElement.current?.imageRef.current;

    if (img) {
      const errorListener = img.addEventListener('error', () => {
        setLoadFailed(true);
      });

      return () => img.removeEventListener('error', errorListener);
    }
  }, [publicID, imageElement.current?.imageRef.current]);

  if (!publicID || publicID == '' || loadFailed) {
    return (
      <PlaceholderImage
        siteName="IncidentDatabase.AI"
        itemIdentifier={itemIdentifier}
        title={title || alt}
        className={className}
        height={height}
        style={style}
      />
    );
  } else {
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

    return (
      <AdvancedImage
        ref={imageElement}
        alt={alt}
        className={className}
        cldImg={image}
        plugins={plugins}
        style={style}
      />
    );
  }
};

export { getCloudinaryPublicID, Image };
