// import React, { useState, useRef, useEffect } from 'react';
// import { AdvancedImage, lazyload } from '@cloudinary/react';
// import { CloudinaryImage } from '@cloudinary/base';
// import { format, quality } from '@cloudinary/base/actions/delivery';
// import { auto } from '@cloudinary/base/qualifiers/format';
// import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
// import config from '../../config';
// import PlaceholderImage from 'components/PlaceholderImage';

import React, { useState, useRef, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { defaultImage, format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';

// const IMG_FALLBACK = 'b5lv0fgght17skl7zyns.webp';
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

  // const fetchTweet = useCallback(
  //   async (tweetUrl) => {
  //     try {
  //       const url = `/api/twitter?url=${encodeURIComponent(tweetUrl)}`;
  //       const response = await fetch(url);

  //       if (!response.ok) {
  //         throw new Error('Scrape error');
  //       }

  //       const res = await response.json();
  //       console.log('scrape result: ', res?.media_url_https);
  //       setTweetThumb(res?.media_url_https);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }, [publicID]
  // )

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

  // dont need this twitter part/

  // useEffect(() => {
  //   setCloudinaryID(getCloudinaryPublicID(tweetThumb));
  //   image.transformation = tmpImage.transformation.toString();
  // }, [tweetThumb])

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

// const Image = ({
//   publicID,
//   className = '',
//   alt,
//   transformation = null,
//   plugins = [lazyload()],
//   style,
//   height = '800px',
//   title,
//   itemIdentifier,
// }) => {
//   const imageElement = useRef(null);

//   const [loadFailed, setLoadFailed] = useState(!publicID || publicID == 'placeholder.svg');

//   useEffect(() => {
//     setLoadFailed(false);
//     const img = imageElement.current?.imageRef.current;

//     if (img) {
//       const errorListener = img.addEventListener('error', () => {
//         setLoadFailed(true);
//       });

//       return () => img.removeEventListener('error', errorListener);
//     }
//   }, [publicID, imageElement.current?.imageRef.current]);

//   if (!publicID || publicID == '' || loadFailed) {
//     return (
//       <PlaceholderImage
//         siteName="IncidentDatabase.AI"
//         itemIdentifier={itemIdentifier}
//         title={title || alt}
//         className={className}
//         height={height}
//         style={style}
//       />
//     );
//   } else {
//     const image = new CloudinaryImage(publicID, {
//       cloudName: config.cloudinary.cloudName,
//     });

//     //TODO: this is a fix for this issue: https://github.com/PartnershipOnAI/aiid/issues/260
//     // Setting transformation as a string skips the safe url check here: https://github.com/cloudinary/js-url-gen/blob/9a3d0a29ea77ddfd6f7181251615f34c2d8a6c5d/src/assets/CloudinaryFile.ts#L279
//     const tmpImage = new CloudinaryImage();

//     tmpImage.delivery(format(auto())).delivery(quality(qAuto()));

//     if (transformation) {
//       tmpImage.addTransformation(transformation);
//     }

//     image.transformation = tmpImage.transformation.toString();

//     return (
//       <AdvancedImage
//         ref={imageElement}
//         alt={alt}
//         className={className}
//         cldImg={image}
//         plugins={plugins}
//         style={style}
//       />
//     );
//   }
// };

export { getCloudinaryPublicID, Image };
