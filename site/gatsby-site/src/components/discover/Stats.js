import React from 'react';
import { Trans } from 'react-i18next';
import { useStats } from 'react-instantsearch';
import DisplayOptions from './DisplayOptions';

export default function Stats({ className, ...props }) {
  const { nbHits: count } = useStats(props);

  return (
    <div className={'flex gap-3 items-center ' + className}>
      <span data-cy="display-options">
        <DisplayOptions />
      </span>{' '}
      <div>
        <b>{count}</b> <Trans>search results</Trans>
      </div>
    </div>
  );
}
