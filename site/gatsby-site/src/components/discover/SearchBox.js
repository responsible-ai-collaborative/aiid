import React, { useEffect, useRef, useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import styled from 'styled-components';
import { debounce } from 'debounce';
import { Row, Col } from 'react-bootstrap';
import SearchInput from 'components/forms/SearchInput';

const SearchForm = styled.form`
  display: block;
  position: relative;
`;

function SearchBox({ currentRefinement, refine }) {
  const [query, setQuery] = useState(currentRefinement);

  const debouncedRefine = useRef(debounce((value) => refine(value), 500)).current;

  useEffect(() => {
    if (query != currentRefinement) {
      debouncedRefine(query);
    }
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
        <SearchForm id="searchForm">
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={clear}
            onKeyPress={(e) => {
              e.key === 'Enter' && e.preventDefault();
            }}
          />
        </SearchForm>
      </Col>
    </Row>
  );
}

export default connectSearchBox(SearchBox);
