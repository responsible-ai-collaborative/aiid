import React, { useState, useEffect } from 'react';
import Stats from './Stats';
import DisplayModeSwitch from './DisplayModeSwitch';
import Filters from './Filters';
import CsvExport from './CsvExport';
import Sorting from './Sorting';
import { useInstantSearch } from 'react-instantsearch';
import DisplayOptions from './DisplayOptions';
import ClearFilters from './ClearFilters';
import { Trans } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const Controls = () => {
  const { indexUiState } = useInstantSearch();

  const [expandFilters, setExpandFilters] = useState(false);

  const defaultKeys = ['is_incident_report', 'page', 'display', 'sortBy'];

  const anySelected = Object.keys(indexUiState.refinementList).some(
    (key) => !defaultKeys.includes(key)
  );

  useEffect(() => {
    if (anySelected) {
      setExpandFilters(true);
    }
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-y-2 mt-4">
      <div data-cy="display-options" className="mx-1">
        <DisplayOptions />
      </div>
      <div className="mx-1">
        <Stats />
      </div>

      <div className="mx-1">
        <DisplayModeSwitch />
      </div>

      <div className="mx-1">
        <Sorting />
      </div>

      <div className="ml-1 mr-auto">
        <CsvExport />
      </div>

      <div className="order-2 mx-1 flex gap-1">
        <div>
          <ClearFilters>
            <Trans>Clear Filters</Trans>
          </ClearFilters>
        </div>
        <div className="grid place-content-center">
          <button
            id="expand-filters"
            data-cy="expand-filters"
            onClick={() => setExpandFilters(!expandFilters)}
            className="select-none cursor-pointer bg-none border-none"
          >
            <FontAwesomeIcon
              className="-align-[0.2rem]"
              icon={expandFilters ? faCaretDown : faCaretRight}
              fixedWidth
            />
            {expandFilters ? <Trans>Fewer filters</Trans> : <Trans>More filters</Trans>}
          </button>
        </div>
      </div>

      <div className="basis-full order-3" />

      <Filters {...{ expandFilters }} />
    </div>
  );
};

export default Controls;
