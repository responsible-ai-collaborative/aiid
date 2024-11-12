import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Tags from './Tags';

const TagsControl = ({
  name,
  placeholder,
  className,
  disabled = false,
  options = undefined,
  handleChange = undefined,
}) => {
  const {
    0: { value },
    2: { setTouched, setValue },
  } = useField({ name });

  const { t } = useTranslation(['validation']);

  return (
    <Tags
      id={`${name}-tags`}
      inputId={name}
      placeHolder={placeholder || t('Type and press Enter to add an item')}
      value={value || []}
      onChange={(value) => {
        setTouched(true);
        setValue(value);
        if (handleChange && handleChange.length > 0) {
          handleChange(value);
        }
      }}
      {...{
        name,
        disabled,
        className,
        options,
      }}
    />
  );
};

export default TagsControl;
