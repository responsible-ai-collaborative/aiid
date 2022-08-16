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
    <InputGroup className="tw-max-w-[640px] tw-m-auto tw-relative">
      <FormControl
        className="tw-rounded-tr-[0.3rem] tw-rounded-br-[0.3rem]"
        size={size}
        placeholder={placeHolder}
        maxLength={512}
        value={value}
        onKeyPress={onKeyPress}
        onChange={(event) => onChange(event.currentTarget.value)}
        {...props}
      />
      <div className="tw-absolute tw-h-5 tw-w-5 tw-z-[4] tw-top-[50%] tw-right-[0.3rem] -tw-translate-y-1/2">
        {value !== '' ? (
          <button
            className="tw-select-none tw-bg-none tw-border-none"
            type="reset"
            title="Clear the search query."
            onClick={() => onClear()}
          >
            <FontAwesomeIcon opacity={0.5} icon={faTimesCircle} className="pointer" title="clear" />
          </button>
        ) : (
          <FontAwesomeIcon opacity={0.5} icon={faSearch} className="pointer" />
        )}
      </div>
    </InputGroup>
  );
});
