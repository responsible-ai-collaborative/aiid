import React from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import Filter from './Filter';
import { useMenuContext } from 'contexts/MenuContext';

function Filters() {
  const { isCollapsed } = useMenuContext();

  return (
    <div className="hidden md:flex gap-y-2 mt-3 flex-wrap">
      {REFINEMENT_LISTS.map((list) => (
        <div
          key={list.attribute}
          className={`w-full flex-0-0-auto  ${
            isCollapsed ? 'md:w-1/2 lg:w-1/5' : 'md:w-1/2 xl:w-1/5'
          } px-1 ${list.hidden ? 'hidden' : ''}`}
          data-cy={list.attribute}
        >
          <Filter className="w-full" type={list.type} {...list} />
        </div>
      ))}
    </div>
  );
}

export default Filters;
