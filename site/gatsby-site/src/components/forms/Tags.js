import React, { useRef, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

export default function Tags({
  id,
  inputId,
  placeHolder,
  value,
  onChange,
  name,
  disabled = false,
  labelKey,
  options,
  className,
  allowNew = true,
  stayOpen = false,
  splitChar = ',',
}) {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const commitTag = (tag) => {
    let splitTags = [];

    if (splitChar) {
      splitTags = tag.split(splitChar).map((tag) => tag.trim());
    } else {
      splitTags = [tag.trim()];
    }

    onChange(value ? value.concat(splitTags) : splitTags);
    ref.current.clear();
  };

  return (
    <Typeahead
      className={`Typeahead ${className || ''}`}
      inputProps={{ id: inputId, name }}
      onKeyDown={(e) => {
        if (splitChar && e.key === splitChar) {
          e.preventDefault();
        }
        const splitChars = splitChar ? ['Enter', splitChar] : ['Enter'];

        if (splitChars.includes(e.key) && e.target.value) {
          commitTag(e.target.value);
        }
      }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (e.target.value) {
          commitTag(e.target.value);
        }
        setOpen(false);
      }}
      multiple
      open={open && stayOpen ? true : undefined}
      renderMenu={options ? undefined : () => null}
      onChange={(value) => onChange(value)}
      options={options || []}
      selected={(value || []).filter((v) => v)}
      placeholder={placeHolder}
      {...{
        disabled,
        labelKey,
        ref,
        id,
        allowNew,
      }}
    />
  );
}
