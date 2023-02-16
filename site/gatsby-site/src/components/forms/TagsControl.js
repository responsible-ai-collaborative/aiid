import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Tags from './Tags';

function TagsControl({ name, placeholder, disabled = false }) {
  const {
    0: { value },
    2: { setTouched, setValue },
  } = useField({ name });

  const { t } = useTranslation(['validation']);

  return (
    <Tags
      id={`${name}-tags`}
      name={name}
      inputId={name}
      placeHolder={placeholder || t('Type and press Enter to add an item')}
      value={value || []}
      onChange={(value) => {
        setTouched(true);
        setValue(value);
      }}
      disabled={disabled}
    />
  );
}

export default TagsControl;
