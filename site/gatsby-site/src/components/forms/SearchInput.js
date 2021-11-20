import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';

const SearchStatus = styled.div`
  position: absolute;
  z-index: 4;
  width: 20px;
  height: 20px;
  top: 50%;
  right: 0.3rem;
  transform: translateY(-50%);
`;

const SearchResetButton = styled.button`
  background: none;
  user-select: none;
  border: none;
`;

export default function SearchInput({
  value,
  onChange,
  onClear,
  onKeyPress,
  size = 'sm',
  placeHolder = 'Type Here',
}) {
  return (
    <InputGroup className="position-relative">
      <FormControl
        size={size}
        placeholder={placeHolder}
        maxLength={512}
        value={value}
        onKeyPress={onKeyPress}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      <SearchStatus>
        {value !== '' ? (
          <SearchResetButton type="reset" title="Clear the search query." onClick={() => onClear()}>
            <FontAwesomeIcon opacity={0.5} icon={faTimesCircle} className="pointer" title="clear" />
          </SearchResetButton>
        ) : (
          <FontAwesomeIcon opacity={0.5} icon={faSearch} className="pointer" />
        )}
      </SearchStatus>
    </InputGroup>
  );
}
