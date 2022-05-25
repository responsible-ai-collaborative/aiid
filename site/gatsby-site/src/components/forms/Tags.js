import React, { useRef } from 'react';
import Typeahead from './Typeahead';

export default function Tags({ id, inputId, placeHolder, value, onChange }) {
  const ref = useRef(null);

  const commitTag = (tag) => {
    onChange(value ? value.concat(tag) : [tag]);
    ref.current.clear();
  };

  return (
    <Typeahead
      ref={ref}
      id={id}
      inputProps={{ id: inputId }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.value) {
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
      selected={value}
      options={[]}
      placeholder={placeHolder}
    />
  );
}
