import React, { useEffect, useRef, useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'debounce';
import { InputGroup, FormControl, Row, Col } from 'react-bootstrap';

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

  useEffect(() => {
    setQuery(currentRefinement);
  }, [currentRefinement]);

  const clear = () => {
    setQuery('');
    refine('');
  };

  return (
    <Row>
      <Col>
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
            <SearchStatus>
              {query !== '' ? (
                <SearchResetButton
                  type="reset"
                  title="Clear the search query."
                  onClick={() => clear()}
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="pointer" title="clear" />
                </SearchResetButton>
              ) : (
                <FontAwesomeIcon opacity={0.5} icon={faSearch} className="pointer" />
              )}
            </SearchStatus>
          </InputGroup>
        </SearchForm>
      </Col>
    </Row>
  );
}

export default connectSearchBox(SearchBox);
