import React from 'react';
import { connectStats } from 'react-instantsearch-dom';
import styled from 'styled-components';

function Stats({ className, nbHits }) {
  if (nbHits == 0) {
    return null;
  }

  return (
    <span className={className}>
      <b>{nbHits}</b> reports found
    </span>
  );
}

export default connectStats(styled(Stats)``);
