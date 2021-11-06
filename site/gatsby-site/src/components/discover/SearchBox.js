import React, { useEffect, useRef, useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'debounce';
import { InputGroup, FormControl } from 'react-bootstrap';

const SearchResetButton = styled.button`
  position: absolute;
  z-index: 4;
  width: 20px;
  height: 20px;
  top: 50%;
  right: 0.3rem;
  transform: translateY(-50%);
  background: none;
  user-select: none;
  border: none;
`;

const SearchContainer = styled.div`
  flex-grow: 1;
`;

const SearchForm = styled.form`
  display: block;
  position: relative;
`;

function SearchBox({ currentRefinement, refine }) {
  const [query, setQuery] = useState(currentRefinement);

  const debouncedRefine = useRef(debounce((value) => refine(value), 500)).current;

  useEffect(() => {
    debouncedRefine(query);
  }, [query]);

  const clear = () => {
    setQuery('');
    refine('');
  };

  return (
    <SearchContainer>
      <SearchForm>
        <InputGroup className="position-relative">
          <FormControl
            placeholder="Type Here"
            maxLength={512}
            value={query}
            onKeyPress={(e) => {
              e.key === 'Enter' && e.preventDefault();
            }}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          {query !== '' && (
            <SearchResetButton type="reset" title="Clear the search query." onClick={() => clear()}>
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="pointer fa fa-times-circle"
                title="reset"
              />
            </SearchResetButton>
          )}
        </InputGroup>
      </SearchForm>
    </SearchContainer>
  );
}

export default connectSearchBox(SearchBox);
