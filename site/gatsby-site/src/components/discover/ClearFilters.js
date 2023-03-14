import React from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
import { Button } from 'react-bootstrap';
import useSearch from './useSearch';
import { DEFAULT_SEARCH_KEYS_VALUES } from './DEFAULT_SEARCH_KEYS_VALUES';

const ClearButton = connectCurrentRefinements(({ items, children, refine }) => {
  const { setSearchState, searchState } = useSearch();

  const disabled =
    items.length == 1 &&
    items?.[0]?.currentRefinement?.[0] == 'true' &&
    !searchState.refinementList.hideDuplicates;

  return (
    <div className="bootstrap">
      <Button
        className="no-underline"
        variant="link secondary"
        onClick={() => {
          items = items.filter((item) => !DEFAULT_SEARCH_KEYS_VALUES.includes(item.attribute));
          refine(items);
          setSearchState((state) => ({
            ...state,
            refinementList: { is_incident_report: ['true'] },
          }));
        }}
        disabled={disabled}
      >
        {children}
      </Button>
    </div>
  );
});

const ClearFilters = ({ children }) => <ClearButton clearsQuery>{children}</ClearButton>;

export default ClearFilters;
