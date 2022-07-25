import React from 'react';
import { Trans } from 'react-i18next';
import { connectStats } from 'react-instantsearch-dom';
import styled from 'styled-components';

function Stats({ className, nbHits: count }) {
  if (count == 0) {
    return null;
  }

  return (
    <span className={className}>
      <Trans count={count}>
        <b>{{ count }}</b> reports found
      </Trans>
    </span>
  );
}

export default connectStats(styled(Stats)``);
