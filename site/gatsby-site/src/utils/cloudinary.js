import React, { useState } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/base';
import { defaultImage, format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import styled from 'styled-components';
import config from '../../config';
import TextInputGroup from 'components/TextInputGroup';

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

const PreviewImage = styled(Image)`
  margin: -1rem auto 1rem;
`;

const PreviewImageInputGroup = ({
  cloudinary_id,
  name,
  label,
  placeholder,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  const [cloudinaryID, setCloudinaryID] = useState(cloudinary_id);

  return (
    <>
      <TextInputGroup
        name={name}
        label={label}
        placeholder={placeholder}
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={(e) => {
          try {
            const url = new URL(e.target.value);

            if (url.pathname.length < 8) {
              throw 'InvalidURL';
            }
            const cloudinary_id = getCloudinaryPublicID(e.target.value, 'pai', 'reports');

            setCloudinaryID(cloudinary_id);
          } catch (error) {
            console.log('invalid image URL');
            console.log(error);
            setCloudinaryID('fallback.jpg');
          }
          handleBlur(e);
        }}
      />
      <PreviewImage publicID={cloudinaryID} />
    </>
  );
};

export { getCloudinaryPublicID, Image, PreviewImageInputGroup };
