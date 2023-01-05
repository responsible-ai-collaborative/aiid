import React, { useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';
import TextInputGroup from './TextInputGroup';
import { Image } from 'utils/cloudinary';

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
  const [cloudinaryID, setCloudinaryID] = useState(cloudinary_id);

  // Debounced function needs to be in ref
  // so it can maintain its internal state
  const debouncedUpdateCloudinaryId = useRef(debounce((c) => setCloudinaryID(c), 2000)).current;

  useEffect(() => {
    const id = values.cloudinary_id || cloudinary_id;

    if (id && id.length > 0) {
      // We debounce updating the cloudinary_id to avoid
      // making too many requests to cloudinary
      debouncedUpdateCloudinaryId(id);
    } else {
      // But if the ID is null, then no request will made,
      // so we can update right away.
      setCloudinaryID('');
    }
  }, [cloudinary_id, values.cloudinary_id]);

  return (
    <>
      <TextInputGroup
        {...{
          name,
          label,
          icon,
          placeholder,
          values,
          errors,
          touched,
          handleChange,
          className,
          handleBlur,
          schema,
        }}
      />
      <figure
        data-cy="image-preview-figure"
        id="image-preview-figure"
        className="text-center md:flex md:items-center md:justify-center md:flex-col"
      >
        <div
          className="grid grid-cols-1 grid-rows-1 items-center justify-center mt-4"
          style={{ height: '20vh' }}
        >
          <div style={{ gridRowStart: '1', gridColumnStart: '1', maxHeight: '100%', zIndex: 1 }}>
            <Spinner size="xl" />
          </div>
          <div
            style={{
              gridRowStart: '1',
              gridColumnStart: '1',
              height: '20vh',
              maxWidth: '100%',
              zIndex: 2,
            }}
          >
            <Image
              publicID={cloudinaryID}
              alt={alt}
              height="300"
              className="inline-block mx-auto min-h-48 min-w-48 max-w-full h-full bg-white"
            />
          </div>
        </div>
        <figcaption className="mt-2">
          <Trans>Selected Image</Trans>
        </figcaption>
      </figure>
    </>
  );
}
