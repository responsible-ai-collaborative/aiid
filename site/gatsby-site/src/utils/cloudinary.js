import React from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/base';
import { defaultImage, format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';

const cld = new Cloudinary({
  cloud: {
    cloudName: config.cloudinary.cloudName,
  },
});

const getCloudinaryPublicID = (url) => {
  // https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_files

  const publicID = `reports/${url.replace(/^https?:\/\//, '')}`;

  return publicID;
};

const Image = ({ publicID, className, alt, transformation = null, plugins = [lazyload()] }) => {
  const image = cld.image(publicID).delivery(defaultImage('fallback.jpg'));

  image.delivery(format(auto())).delivery(quality(qAuto()));

  if (transformation) {
    image.addTransformation(transformation);
  }

  return <AdvancedImage alt={alt} className={className} cldImg={image} plugins={plugins} />;
};

export { getCloudinaryPublicID, Image };
