import React, { useEffect, useRef, useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { debounce } from 'debounce';
import SearchInput from 'components/forms/SearchInput';

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
    <div className='flex flex-wrap -ml-3 mr-0 mt-0'>
      <div className='w-full lg:flex-1'>
        <form className="block relative" id="searchForm">
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={clear}
            onKeyPress={(e) => {
              e.key === 'Enter' && e.preventDefault();
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default connectSearchBox(SearchBox);
