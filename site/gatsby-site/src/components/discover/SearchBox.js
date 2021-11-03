import React, { useEffect, useRef, useState } from 'react';
import { connectSearchBox, Stats } from 'react-instantsearch-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'debounce';

const StyledSearchInput = styled.input`
  padding: 0.3rem 0.3rem !important;
  max-width: 100% !important;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0.3rem 1.7rem;
  width: 100%;
  position: relative;
  background-color: #fff;
  border: 1px solid #c4c8d8;
  border-radius: 5px;
`;

const SearchResetButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  position: absolute;
  z-index: 1;
  width: 20px;
  height: 20px;
  top: 50%;
  right: 0.3rem;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);

  padding: 0;
  overflow: visible;
  font: inherit;
  line-height: normal;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const SearchContainer = styled.div`
  flex-grow: 1;
`;

const SearchForm = styled.form`
  display: block;
  position: relative;
`;

const StyledStats = styled(Stats)`
  position: absolute;
  top: 4px;
  right: 28px;
  z-index: 1;
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
        <StyledSearchInput
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Search"
          spellCheck="false"
          maxLength={512}
          value={query}
          onKeyPress={(e) => {
            e.key === 'Enter' && e.preventDefault();
          }}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <SearchResetButton type="reset" title="Clear the search query." onClick={() => clear()}>
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="pointer fa fa-times-circle"
            title="reset"
          />
        </SearchResetButton>
        <StyledStats
          translations={{
            stats(nbHits) {
              return (
                <span className="badge bg-secondary badge-pill">{`${
                  nbHits === 0 ? 'No' : nbHits
                } reports found`}</span>
              );
            },
          }}
        />
      </SearchForm>
    </SearchContainer>
  );
}

export default connectSearchBox(SearchBox);
