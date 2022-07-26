import { useField } from 'formik';
import React from 'react';
import Tags from './Tags';

function TagsControl({ name }) {
  const {
    0: { value },
    2: { setTouched, setValue },
  } = useField({ name });

  return (
    <Tags
      id={`${name}-tags`}
      inputId={name}
      placeHolder="Type and press Enter to add an item"
      value={value}
      onChange={(value) => {
        setTouched(true);
        setValue(value);
      }}
    />
  );
}

export default TagsControl;
