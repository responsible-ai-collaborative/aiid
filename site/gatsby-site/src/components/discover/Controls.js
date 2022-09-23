import React, { useState, useEffect } from 'react';
import REFINEMENT_LISTS from './REFINEMENT_LISTS';
import Stats from './Stats';
import ClearFilters from './ClearFilters';
import DisplayModeSwitch from './DisplayModeSwitch';
import Filters from './Filters';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';

const Controls = ({ query, searchState, setSearchState }) => {
  const [expandFilters, setExpandFilters] = useState(false);

  useEffect(() => setExpandFilters(REFINEMENT_LISTS.some((r) => query[r.attribute])), []);

  return (
    <>
      <div className="flex flex-wrap -ml-3 mr-0 content-start items-center mt-4 767px:hidden hiddenMobile">
        <div className="w-auto flex-0-0-auto col-auto px-3">
          <Stats />
        </div>
        <div className="w-auto flex-0-0-auto col-auto px-3">
          <DisplayModeSwitch />
        </div>
        <div className="w-full lg:flex-1 items-center flex gap-1 pr-0">
          <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox"
              id="hide-duplicates" className="sr-only peer" checked={searchState.refinementList.hideDuplicates} onClick={(event) => {
                setSearchState({
                  ...searchState,
                  refinementList: {
                    ...searchState.refinementList,
                    hideDuplicates: event.target.checked,
                  },
                });
              }} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"><Trans>1st report only</Trans></span>
          </label>
        </div>
        <div className="w-auto flex-0-0-auto bootstrap">
          <ClearFilters>
            <Trans>Clear Filters</Trans>
          </ClearFilters>
        </div>
        <div className="w-auto flex-0-0-auto bootstrap">
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
            <Trans>Filter Search</Trans>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap -ml-3 mr-0 mt-0 mb-3 hiddenMobile">{expandFilters && <Filters />}</div>
    </>
  );
};

export default Controls;
