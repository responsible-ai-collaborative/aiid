import React from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import Filter from './Filter';
import styled from 'styled-components';

const StyledFilter = styled(Filter)`
  width: 100%;
  .dropdown-toggle {
    width: 100%;
  }
`;

function Filters() {
  return (
    <div className="hidden md:flex gap-y-2 mt-3 flex-wrap">
      {REFINEMENT_LISTS.map((list) => (
        <div
          key={list.attribute}
          className={`w-full flex-0-0-auto md:w-1/2 lg:w-1/5 px-1 bootstrap ${
            list.hidden ? 'hidden' : ''
          }`}
          data-cy={list.attribute}
        >
          <StyledFilter type={list.type} {...list} />
        </div>
      ))}
    </div>
  );
}

export default Filters;
