import React from 'react';
import { connectRange, connectRefinementList, connectSearchBox } from 'react-instantsearch-core';
import REFINEMENT_LISTS from './REFINEMENT_LISTS';
import useSearch from './useSearch';

const VirtualRefinementList = connectRefinementList(() => null);

const VirtualRange = connectRange(() => null);

const VirtualSearchBox = connectSearchBox(() => null);

const componentsMap = {
  refinement: VirtualRefinementList,
  range: VirtualRange,
};

// SEE: https://github.com/algolia/react-instantsearch/issues/302

const defaultRefinement = (type) => {
  switch (type) {
    case 'refinement':
      return [];
    default:
      return {};
  }
};

export default function VirtualFilters() {
  const { searchState } = useSearch();

  return (
    <>
      <VirtualSearchBox defaultRefinement={searchState.query} />

      {REFINEMENT_LISTS.map((list) => {
        const Component = componentsMap[list.type];

        return (
          <Component
            key={list.attribute}
            attribute={list.attribute}
            defaultRefinement={
              searchState.refinementList[list.attribute] || defaultRefinement(list.type)
            }
          />
        );
      })}
    </>
  );
}
