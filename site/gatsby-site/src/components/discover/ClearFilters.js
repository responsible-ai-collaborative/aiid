import React, { useContext } from 'react';
import { useCurrentRefinements } from 'react-instantsearch';
import { useInstantSearch } from 'react-instantsearch';
import { ConfigureContext } from './ConfigureContext';

function ClearButton({ children }) {
  const { setIndexUiState } = useInstantSearch();

  const { configure, setConfigure } = useContext(ConfigureContext);

  const { items } = useCurrentRefinements();

  const disabled =
    items.length == 1 && items?.[0]?.refinements?.[0].value == 'true' && !configure?.distinct;

  return (
    <button
      className="text-blue-600 cursor-pointer disabled:cursor-default disabled:text-gray-500 no-underline"
      onClick={() => {
        setIndexUiState((state) => ({
          ...state,
          refinementList: { is_incident_report: ['true'] },
        }));

        setConfigure({ distinct: false, hitsPerPage: 28 });
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

const ClearFilters = ({ children }) => <ClearButton>{children}</ClearButton>;

export default ClearFilters;
