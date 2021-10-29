import React from 'react';
import RangeInput from './filters/RangeInput';
import RefinementList from './filters/RefinementList';

const componentsMap = {
  refinement: RefinementList,
  range: RangeInput,
};

export default function Filter({ type, ...rest }) {
  const Component = componentsMap[type];

  return <Component {...rest} />;
}
