import React, { useRef } from 'react';
import Typeahead from './Typeahead';

export default function Tags({
  id,
  inputId,
  placeHolder,
  value,
  onChange,
  name,
  disabled = false,
}) {
  const ref = useRef(null);

  const commitTag = (tag) => {
    const splitTags = tag.split(',').map((tag) => tag.trim());

    onChange(value ? value.concat(splitTags) : splitTags);
    ref.current.clear();
  };

  return (
    <Typeahead
      ref={ref}
      id={id}
      inputProps={{ id: inputId, name }}
      onKeyDown={(e) => {
        if (e.key === ',') {
          e.preventDefault();
        }
        if (['Enter', ','].includes(e.key) && e.target.value) {
          commitTag(e.target.value);
        }
      }}
      onBlur={(e) => {
        if (e.target.value) {
          commitTag(e.target.value);
        }
      }}
      allowNew
      multiple
      renderMenu={() => null}
      onChange={(value) => onChange(value)}
      options={[]}
      selected={value}
      placeholder={placeHolder}
      disabled={disabled}
    />
  );
}
