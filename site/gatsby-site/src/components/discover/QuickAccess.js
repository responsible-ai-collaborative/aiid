import React from 'react';
import styled from 'styled-components';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
  background-color: #f8f8f8;
  font-family: Karla, sans-serif !important;
  font-weight: bold;
  color: #001934;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    color: #001934;
  }
`;

/*const Circle = styled.div`
  width: 8px;
  height: 8px;
  background-color: var(--primary3);
  border-radius: 50%;
  margin: 0 12px;
  flex-shrink: 0;
`;*/

export default function DiscoverQuickAccess({ className }) {
  return (
    <Wrapper className={`${className}`}>
      <LocalizedLink
        to="/apps/discover"
        className="fs-5 tw-pb-4 tw-pt-4 tw-w-1/2 text-center tw-shadow"
      >
        <div className="tw-text-2xl">
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <Trans>Discover</Trans>
      </LocalizedLink>
      {/*<Circle />*/}
      <LocalizedLink
        to="/apps/submit"
        className="fs-5 tw-pb-4 tw-pt-4 tw-w-1/2 text-center tw-shadow"
      >
        <div className="tw-text-2xl">
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <Trans>Submit</Trans>
      </LocalizedLink>
    </Wrapper>
  );
}
