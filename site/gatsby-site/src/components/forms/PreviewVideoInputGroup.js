import React, { useState, useEffect } from 'react';
import { Trans } from 'react-i18next';
import TextInputGroup from './TextInputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useField } from 'formik';
import ReactPlayer from 'react-player';

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
  icon,
}) {
  const [{ value }, { error }] = useField({ name });

  const [videoError, setVideoError] = useState(false);

  const handleError = () => {
    if (!error) {
      setVideoError(true);
    }
  };

  const handleReady = () => {
    setVideoError(false);
  };

  useEffect(() => {
    if (value == '') {
      setVideoError(false);
    }
  }, [value]);

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
      {videoError && touched[name] && (
        <span className="text-sm text-orange-600 italic">
          <FontAwesomeIcon icon={faExclamationTriangle} /> <Trans>Error loading video</Trans>
        </span>
      )}
      {value && (
        <div className="video-preview">
          <ReactPlayer url={value} onError={handleError} onReady={handleReady} />
        </div>
      )}
    </>
  );
}
