import React, { useState, useEffect } from 'react';
import { useMenuContext } from 'contexts/MenuContext';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import REFINEMENT_LISTS, { FIRST_ROW } from 'components/discover/REFINEMENT_LISTS';
import Filter from './Filter';
import ClearFilters from './ClearFilters';

function Filters({ indexUiState }) {
  const { isCollapsed } = useMenuContext();

  console.log(`REFINEMENT_LISTS`, REFINEMENT_LISTS);
  console.log(`FIRST_ROW`, FIRST_ROW);

  const [expandFilters, setExpandFilters] = useState(false);

  const defaultKeys = ['is_incident_report', 'page', 'display', 'sortBy'];

  const anySelected = Object.keys(indexUiState.refinementList).some(
    (key) => !defaultKeys.includes(key)
  );

  useEffect(() => {
    setExpandFilters(anySelected);
  }, []);

  return (
    <div className="flex justify-center items-center mt-3 w-full">
      <div className="whitespace-nowrap w-[4.5rem] flex justify-end items-center shrink-0 mr-1">
        <ClearFilters>
          <FontAwesomeIcon icon={faCircleXmark} fixedWidth />
        </ClearFilters>
        Filter by
        {/*<button className="text-gray-400 mt-[4px] ml-[3px]">
              <FontAwesomeIcon icon={faCircleXmark} fixedWidth />
            </button>*/}
      </div>
      <div className="hidden md:flex gap-y-2 flex-wrap flex-grow">
        {REFINEMENT_LISTS.map((list) => {
          const secondRowNotExpanded = !expandFilters && !FIRST_ROW.includes(list);

          const hide = list.hidden || secondRowNotExpanded;

          return (
            <div
              key={list.attribute}
              className={`w-full flex-0-0-auto  ${
                isCollapsed ? 'md:w-1/2 lg:w-1/5' : 'md:w-1/2 xl:w-1/5'
              } px-1 ${hide ? 'hidden' : ''}`}
              data-cy={list.attribute}
            >
              <Filter className="w-full" type={list.type} {...list} />
            </div>
          );
        })}
      </div>
      <button
        id="expand-filters"
        data-cy="expand-filters"
        onClick={() => setExpandFilters(!expandFilters)}
        className="select-none cursor-pointer bg-none border-none whitespace-nowrap w-[4.5rem] shrink-0"
      >
        {expandFilters ? <Trans>show less</Trans> : <Trans>show more</Trans>}
      </button>
    </div>
  );
}

export default Filters;
