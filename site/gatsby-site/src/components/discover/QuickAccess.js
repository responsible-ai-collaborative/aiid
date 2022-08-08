import React from 'react';
import styled from 'styled-components';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Trans } from 'react-i18next';

const Wrapper = styled.div`
  background-color: #f8f8f8;
  font-family: Karla, sans-serif !important;
  font-weight: bold;
  color: #001934;
  display: flex;
  align-items: center;
  a {
    color: #001934;
  }
`;

const Circle = styled.div`
  width: 8px;
  height: 8px;
  background-color: var(--primary3);
  border-radius: 50%;
  margin: 0 12px;
`;

export default function DiscoverQuickAccess({ className }) {
  return (
    <Wrapper className={`${className} p-2 p-md-4`}>
      <LocalizedLink to="/apps/discover" className="fs-5">
        <Trans>Discover</Trans>
      </LocalizedLink>
      <Circle />
      <LocalizedLink to="/apps/submit" className="fs-5">
        <Trans>Submit</Trans>
      </LocalizedLink>
    </Wrapper>
  );
}
