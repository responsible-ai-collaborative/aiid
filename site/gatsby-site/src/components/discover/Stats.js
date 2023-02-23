import React from 'react';
import { Trans } from 'react-i18next';
import { connectStats } from 'react-instantsearch-dom';
import styled from 'styled-components';
import DisplayOptions from './DisplayOptions';

function Stats({ className, nbHits: count }) {
  return (
    <div className={'flex gap-3 items-center ' + className}>
      <Trans count={count}>
        <b>{{ count }}</b>{' '}
        <span data-cy="display-options">
          <DisplayOptions />
        </span>{' '}
        found
      </Trans>
    </div>
  );
}

export default connectStats(styled(Stats)``);
