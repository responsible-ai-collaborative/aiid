import React, { useState } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { defaultImage, format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import styled from 'styled-components';
import config from '../../config';
import TextInputGroup from 'components/forms/TextInputGroup';

const getCloudinaryPublicID = (url) => {
  // https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_files

  const publicID = `reports/${url.replace(/^https?:\/\//, '')}`;

  return publicID;
};

const Image = ({ publicID, className, alt, transformation = null, plugins = [lazyload()] }) => {
  const image = new CloudinaryImage(publicID, { cloudName: config.cloudinary.cloudName });

  //TODO: this is a fix for this issue: https://github.com/PartnershipOnAI/aiid/issues/260
  // Setting transformation as a string skips the safe url check here: https://github.com/cloudinary/js-url-gen/blob/9a3d0a29ea77ddfd6f7181251615f34c2d8a6c5d/src/assets/CloudinaryFile.ts#L279
  const tmpImage = new CloudinaryImage();

  tmpImage.delivery(defaultImage('fallback.jpg'));
  tmpImage.delivery(format(auto())).delivery(quality(qAuto()));

  if (transformation) {
    tmpImage.addTransformation(transformation);
  }

  image.transformation = tmpImage.transformation.toString();

  return <AdvancedImage alt={alt} className={className} cldImg={image} plugins={plugins} />;
};

const PreviewImage = styled(Image)`
  margin: -1rem auto 1rem;
  max-height: 50vh;
`;

const PreviewFigure = styled.figure`
  text-align: center;
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
  className = '',
}) => {
  const [cloudinaryID, setCloudinaryID] = useState(cloudinary_id);

  const updateImage = (e) => {
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
  };

  return (
    <>
      <TextInputGroup
        name={name}
        label={label}
        placeholder={placeholder}
        values={values}
        errors={errors}
        touched={touched}
        handleChange={(e) => {
          updateImage(e);
          handleChange(e);
        }}
        className={className}
        handleBlur={(e) => {
          updateImage(e);
          handleBlur(e);
        }}
      />
      <PreviewFigure data-cy="image-preview-figure">
        <PreviewImage
          className={'mt-3'}
          publicID={
            cloudinaryID ||
            (values?.cloudinary_id === 'reports/' ? null : values?.cloudinary_id) ||
            'fallback.jpg'
          }
        />
        <figcaption>Selected Image</figcaption>
      </PreviewFigure>
    </>
  );
};

export { getCloudinaryPublicID, Image, PreviewImageInputGroup };
