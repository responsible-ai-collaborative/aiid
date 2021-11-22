import React from 'react';
import hitModes from './hitTypes';
import { useQueryParam } from 'use-query-params';
import { DisplayModeEnumParam } from './queryParams';
export default function Hit(props) {
  const [display] = useQueryParam('display', DisplayModeEnumParam);

  const Component = hitModes[display].default;

  return <Component {...props} />;
}
