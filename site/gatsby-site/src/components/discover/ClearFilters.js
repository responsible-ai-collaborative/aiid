import React, { useContext } from 'react';
import { useCurrentRefinements, useInstantSearch } from 'react-instantsearch';
import DiscoverConfigureContext from './DiscoverConfigureContext';

function ClearButton({ children }) {
  const { indexUiState, setIndexUiState } = useInstantSearch();

  // `distinct` is declared on the single <Configure> in Discover.js.
  // SEE: DiscoverConfigureContext.
  const { distinct, setDistinct } = useContext(DiscoverConfigureContext);

  const { items } = useCurrentRefinements();

  const disabled =
    items.length == 1 &&
    items?.[0]?.refinements?.[0].value == 'true' &&
    distinct == true &&
    !indexUiState.query;

  return (
    <button
      className="disabled:hidden cursor-pointer no-underline mr-1 mt-[1px]"
      onClick={() => {
        setIndexUiState((state) => ({
          ...state,
          refinementList: { is_incident_report: ['true'] },
          range: {},
          query: '',
        }));

        setDistinct(true);
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

const ClearFilters = ({ children }) => <ClearButton>{children}</ClearButton>;

export default ClearFilters;
