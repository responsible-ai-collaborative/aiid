import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

export default withTranslation()(function SearchInput({
  value,
  onChange,
  onClear,
  onKeyPress,
  size = 'sm',
  t,
  placeHolder = t('Type Here'),
  ...props
}) {
  return (
    <div className="bootstrap">
      <InputGroup className="max-w-[640px] m-auto relative">
        <FormControl
          className="rounded-tr-[0.3rem] rounded-br-[0.3rem]"
          size={size}
          placeholder={placeHolder}
          maxLength={512}
          value={value}
          onKeyPress={onKeyPress}
          onChange={(event) => onChange(event.currentTarget.value)}
          {...props}
        />
        <div className="absolute z-[4] w-5 top-1/2 right-[0.3rem] -translate-y-1/2 flex justify-center items-center">
          {value !== '' ? (
            <button
              className="bg-none select-none border-none"
              type="reset"
              title="Clear the search query."
              onClick={() => onClear()}
            >
              <FontAwesomeIcon
                opacity={0.5}
                icon={faTimesCircle}
                className="pointer"
                title="clear"
              />
            </button>
          ) : (
            <FontAwesomeIcon opacity={0.5} icon={faSearch} className="pointer" />
          )}
        </div>
      </InputGroup>
    </div>
  );
});
