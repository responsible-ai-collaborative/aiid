import React, { useContext } from 'react';

const SearchContext = React.createContext({
  searchState: {},
  setSearchState: null,
  indexName: null,
  searchClient: null,
  onSearchStateChange: null,
});

// This could be improved here and everywhere once Aloglia releases their hook-based library
// https://github.com/algolia/react-instantsearch/tree/master/packages/react-instantsearch-hooks#getting-started

function useSearch() {
  const context = useContext(SearchContext);

  return context;
}

export { SearchContext };

export default useSearch;
