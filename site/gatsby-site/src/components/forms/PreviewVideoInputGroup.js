import React, { useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';
import TextInputGroup from './TextInputGroup';
import { Image } from 'utils/cloudinary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useField } from 'formik';

export default function PreviewVideoInputGroup({
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

  const [{ value }, , { setTouched, setValue }] = useField({ name });

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
      {/* {imageLoadedFailed && touched[name] && (
        <span className="text-sm text-orange-600 italic">
          <FontAwesomeIcon icon={faExclamationTriangle} />{' '}
          <Trans>Image URL is invalid, using fallback image</Trans>
        </span>
      )} */}
      {value}
    </>
  );
}
