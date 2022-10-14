import React, { useState, useRef, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { defaultImage, format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';
import TextInputGroup from '../components/forms/TextInputGroup';
import { Spinner } from 'flowbite-react';
import { isWebUri } from 'valid-url';
import { Trans } from 'react-i18next';

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
  const [cloudinaryId, setCloudinaryID] = useState(publicID);

  const imageElement = useRef(null);

  const image = new CloudinaryImage(cloudinaryId.replace(/%/g, '%25'), {
    cloudName: config.cloudinary.cloudName,
  });

  //TODO: this is a fix for this issue: https://github.com/PartnershipOnAI/aiid/issues/260
  // Setting transformation as a string skips the safe url check here: https://github.com/cloudinary/js-url-gen/blob/9a3d0a29ea77ddfd6f7181251615f34c2d8a6c5d/src/assets/CloudinaryFile.ts#L279
  const tmpImage = new CloudinaryImage();

  tmpImage.delivery(defaultImage('fallback.jpg'));
  tmpImage.delivery(format(auto())).delivery(quality(qAuto()));

  if (transformation) {
    tmpImage.addTransformation(transformation);
  }

  image.transformation = tmpImage.transformation.toString();

  useEffect(() => {
    let fallbackTimeout;

    const useFallbackIfLoadFailed = () => {
      const img = imageElement.current?.imageRef.current;

      if (!img || img.naturalHeight == undefined || img.naturalHeight == 0) {
        if ((img.src || img.srcset) && img.complete) {
          setCloudinaryID('fallback.jpg');
        } else {
          fallbackTimeout = setTimeout(useFallbackIfLoadFailed, 1000);
        }
      }
    };

    setCloudinaryID(publicID);
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
  schema,
}) => {
  const [cloudinaryID, setCloudinaryID] = useState(cloudinary_id);

  // Track whether the image is waiting to update so we can show a spinner.
  const [updatingImage, setUpdatingImage] = useState(false);

  const [imageReferenceError, setImageReferenceError] = useState(false);

  const timeoutID = useRef(null);

  const imageUrl = useRef(values.image_url);

  const updateCloudinaryID = () => {
    if (isWebUri(values.image_url)) {
      // We want to show an error if the given url does not point to an image.
      // We can do this by attempting to load the image ourselves
      // before passing it to Cloudinary, which loads a fallback on error.
      const img = document.createElement('img');

      img.src = values.image_url;
      img.onload = () => {
        setImageReferenceError(false);
        setCloudinaryID(getCloudinaryPublicID(values.image_url));
      };
      img.onerror = () => {
        setCloudinaryID();
        setImageReferenceError(true);
      };
    } else {
      setCloudinaryID();
    }
    setUpdatingImage(false);
  };

  // When the form value changes, wait two seconds,
  // and if it hasn't changed again by then, update the cloudinaryID.
  // This prevents repeated requests for partially-typed URLs.
  if (values.image_url != imageUrl.current) {
    imageUrl.current = values.image_url;
    setUpdatingImage(true);
    clearTimeout(timeoutID.current);
    timeoutID.current = setTimeout(updateCloudinaryID, 2000);
  }

  // Default to fallback so we don't have to hit cloudinary API
  // when we know there will be no match
  if (!cloudinaryID || cloudinaryID == 'reports/') {
    setCloudinaryID('fallback.jpg');
  }

  const childErrors = { ...errors };

  touched.image_url = values.image_url.length > 0;
  if (imageReferenceError) {
    childErrors.image_url ||= '*Url must point to a valid image';
  }

  return (
    <>
      <TextInputGroup
        name={name}
        label={label}
        placeholder={placeholder}
        values={values}
        errors={childErrors}
        touched={touched}
        handleChange={handleChange}
        className={className}
        handleBlur={handleBlur}
        schema={schema}
      />
      <figure data-cy="image-preview-figure" id="image-preview-figure" className="text-center">
        <div
          className="flex items-center justify-center bootstrap"
          style={{ height: '50vh', marginTop: '1rem' }}
        >
          {updatingImage ? (
            <Spinner size="xl" />
          ) : (
            <Image publicID={cloudinaryID} style={{ maxHeight: '100%' }} alt="Selected image" />
          )}
        </div>
        <figcaption className="mt-2">
          <Trans>Selected Image</Trans>
        </figcaption>
      </figure>
    </>
  );
};

export { getCloudinaryPublicID, Image, PreviewImageInputGroup };
