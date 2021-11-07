import React from 'react';
import { connectRange, connectRefinementList } from 'react-instantsearch-core';
import REFINEMENT_LISTS from './REFINEMENT_LISTS';

const VirtualRefinementList = connectRefinementList(() => null);

const VirtualRange = connectRange(() => null);

const componentsMap = {
  refinement: VirtualRefinementList,
  range: VirtualRange,
};

// SEE: https://github.com/algolia/react-instantsearch/issues/302

export default function VirtualFilters({ searchState }) {
  return REFINEMENT_LISTS.map((list) => {
    const Component = componentsMap[list.type];

    return (
      <Component
        key={list.attribute}
        attribute={list.attribute}
        defaultRefinement={searchState.refinementList[list.attribute] || []}
      />
    );
  });
}
