import React, { useState, useRef, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { defaultImage, format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';

const IMG_FALLBACK = 'fallback.jpg';

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
}) => {
  const toVideo = (url) => {
    if (url.startsWith('reports/')) {
      url = url.replace('reports/', '');
    }
    const youtubeRegex =
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/;

    const vimeoRegex = /^https?:\/\/(www.)?vimeo.com\/([a-zA-Z0-9_-]+)/;

    if (youtubeRegex.test(url)) {
      return 'youtube/' + url.match(youtubeRegex)[5];
    }

    if (vimeoRegex.test(url)) {
      return 'vimeo/' + url.match(vimeoRegex)[2];
    }

    return url;
  };

  const [cloudinaryId, setCloudinaryID] = useState(toVideo(publicID));
  // const [tweetThumb, setTweetThumb] = useState('');

  const imageElement = useRef(null);

  //TODO: this is a fix for this issue: https://github.com/PartnershipOnAI/aiid/issues/260
  // Setting transformation as a string skips the safe url check here: https://github.com/cloudinary/js-url-gen/blob/9a3d0a29ea77ddfd6f7181251615f34c2d8a6c5d/src/assets/CloudinaryFile.ts#L279

  const tmpImage = new CloudinaryImage();

  tmpImage.delivery(defaultImage(IMG_FALLBACK));
  tmpImage.delivery(format(auto())).delivery(quality(qAuto()));

  if (transformation) {
    tmpImage.addTransformation(transformation);
  }

  const image = new CloudinaryImage(cloudinaryId, {
    cloudName: config.cloudinary.cloudName,
  });

  if (cloudinaryId && cloudinaryId.startsWith('youtube/')) {
    image.setPublicID(cloudinaryId.replace('youtube/', ''));
    image.setDeliveryType('youtube');
    image.transformation = tmpImage.transformation.toString();
  } else if (cloudinaryId && cloudinaryId.startsWith('vimeo/')) {
    image.setPublicID(cloudinaryId.replace('vimeo/', ''));
    image.setDeliveryType('vimeo');
    image.transformation = tmpImage.transformation.toString();
  } else {
    image.transformation = tmpImage.transformation?.toString();
  }

  useEffect(() => {
    let fallbackTimeout;

    const useFallbackIfLoadFailed = () => {
      const img = imageElement.current?.imageRef.current;

      if (!img || img.naturalHeight == undefined || img.naturalHeight == 0) {
        if ((img.src || img.srcset) && img.complete) {
          setCloudinaryID(IMG_FALLBACK);
        } else {
          fallbackTimeout = setTimeout(useFallbackIfLoadFailed, 1000);
        }
      }
    };

    useFallbackIfLoadFailed();

    return () => clearTimeout(fallbackTimeout);
  }, [publicID]);

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
};

export { getCloudinaryPublicID, Image };
