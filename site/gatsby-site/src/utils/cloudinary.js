import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/base';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'pai',
  },
});

const getCloudinaryPublicID = (url) => {
  // https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_files

  const publicID = `/reports/${url.replace(/^https?:\/\//, '')}`;

  return publicID;
};

const Image = ({ publicID, className }) => {
  const image = cld.image(publicID);

  return <AdvancedImage className={className} cldImg={image} />;
};

export { getCloudinaryPublicID, Image };
