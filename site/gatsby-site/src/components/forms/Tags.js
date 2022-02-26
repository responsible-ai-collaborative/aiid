import React, { useRef } from 'react';
import Typeahead from './Typeahead';

export default function Tags({ id, inputId, placeHolder, value, onChange }) {
  const ref = useRef(null);

  return (
    <Typeahead
      ref={ref}
      id={id}
      inputProps={{ id: inputId }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onChange(value.concat(e.target.value));
          ref.current.clear();
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
