import React from 'react';
import { Trans } from 'react-i18next';
import { useStats } from 'react-instantsearch';

export default function Stats({ className, ...props }) {
  const { nbHits: count } = useStats(props);

  return (
    <div className={'flex gap-3 items-center ' + className}>
      <div>
        <b>{count}</b> <Trans>results found</Trans>
      </div>
    </div>
  );
}
