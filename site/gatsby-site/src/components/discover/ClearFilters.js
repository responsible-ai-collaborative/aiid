import React, { useEffect, useState } from 'react';
import { Configure, useCurrentRefinements } from 'react-instantsearch';
import { useInstantSearch } from 'react-instantsearch';

function ClearButton({ children }) {
  const { indexUiState, setIndexUiState } = useInstantSearch();

  const [configure, setConfigure] = useState({ ...indexUiState.configure });

  const { items } = useCurrentRefinements();

  useEffect(() => {
    setConfigure((configure) => ({ ...configure, ...indexUiState.configure }));
  }, [indexUiState]);

  const disabled =
    items.length == 1 &&
    items?.[0]?.refinements?.[0].value == 'true' &&
    configure?.distinct == true &&
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
          configure: { distinct: true, hitsPerPage: 28 },
        }));

        setConfigure((configure) => ({ ...configure, distinct: true }));
      }}
      disabled={disabled}
    >
      <Configure {...configure} />

      {children}
    </button>
  );
}

const ClearFilters = ({ children }) => <ClearButton>{children}</ClearButton>;

export default ClearFilters;
