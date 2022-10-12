import React, { useEffect, useRef, useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { debounce } from 'debounce';
import SearchInput from 'components/forms/SearchInput';
import Row from 'elements/Row';
import Col from 'elements/Col';

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

  // SearchInput component was causing rehydration errors

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const clear = () => {
    setQuery('');
    refine('');
  };

  return (
    <Row>
      <Col>
        <form className="block relative" id="searchForm">
          {mounted && (
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={clear}
              onKeyPress={(e) => {
                e.key === 'Enter' && e.preventDefault();
              }}
            />
          )}
        </form>
      </Col>
    </Row>
  );
}

export default connectSearchBox(SearchBox);
