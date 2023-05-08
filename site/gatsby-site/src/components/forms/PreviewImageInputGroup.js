import React, { useState, useRef, useEffect } from 'react';

import { Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';
import TextInputGroup from './TextInputGroup';
import { Image } from 'utils/cloudinary';
import { isWebUri } from 'valid-url';

const IMG_FALLBACK = 'fallback.jpg';

export default function PreviewImageInputGroup({
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
  alt = '',
  icon,
}) {
  const [cloudinaryID, setCloudinaryID] = useState(IMG_FALLBACK);

  // Track whether the image is waiting to update so we can show a spinner.
  const [updatingImage, setUpdatingImage] = useState(false);

  const [imageReferenceError, setImageReferenceError] = useState(false);

  const timeoutID = useRef(null);

  const imageUrl = useRef(values.media_url);

  const isVideo = (url) => {
    const youtubeRegex =
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/;

    const vimeoRegex = /^https?:\/\/(www.)?vimeo.com\/([a-zA-Z0-9_-]+)/;
    // const twitterRegex = /^https:\/\/(www.)?twitter.com\/\w+\/status\/([0-9]+)/;

    if (youtubeRegex.test(url)) {
      return 'youtube/' + url.match(youtubeRegex)[5];
    }

    if (vimeoRegex.test(url)) {
      return 'vimeo/' + url.match(vimeoRegex)[2];
    }

    return false;
  };

  const updateCloudinaryID = () => {
    if (isWebUri(values.media_url)) {
      const videoPublicID = isVideo(values.media_url);

      if (videoPublicID) {
        setImageReferenceError(false);
        setCloudinaryID(values.media_url);
      } else {
        setCloudinaryID(IMG_FALLBACK);
      }
    } else {
      setCloudinaryID(IMG_FALLBACK);
    }
    setUpdatingImage(false);
  };

  // When the form value changes, wait two seconds,
  // and if it hasn't changed again by then, update the cloudinaryID.
  // This prevents repeated requests for partially-typed URLs.
  if (values.media_url != imageUrl.current) {
    imageUrl.current = values.media_url;
    setUpdatingImage(true);
    clearTimeout(timeoutID.current);
    timeoutID.current = setTimeout(updateCloudinaryID, 2000);
  }

  useEffect(() => {
    // Default to fallback so we don't have to hit cloudinary API
    // when we know there will be no match

    if (!cloudinary_id || cloudinary_id == 'reports/') {
      setCloudinaryID(IMG_FALLBACK);
    } else {
      setCloudinaryID(cloudinary_id);
    }
  }, [cloudinary_id]);

  const childErrors = { ...errors };

  touched.media_url = values.media_url.length > 0;
  if (imageReferenceError) {
    childErrors.media_url ||= '*Url must point to a valid image';
  }

  return (
    <>
      <TextInputGroup
        name={name}
        label={label}
        icon={icon}
        placeholder={placeholder}
        values={values}
        errors={childErrors}
        touched={touched}
        handleChange={handleChange}
        className={className}
        handleBlur={handleBlur}
        schema={schema}
      />
      <figure
        data-cy="image-preview-figure"
        id="image-preview-figure"
        className="text-center md:flex md:items-center md:justify-center md:flex-col"
      >
        <div
          className="flex items-center justify-center bootstrap md:max-w-prose"
          style={{ height: '20vh', marginTop: '1rem' }}
        >
          {updatingImage ? (
            <Spinner size="xl" />
          ) : (
            <Image publicID={cloudinaryID} style={{ maxHeight: '100%' }} alt={alt} />
          )}
        </div>
        <figcaption className="mt-2">
          <Trans>Selected Media</Trans>
        </figcaption>
      </figure>
    </>
  );
}
