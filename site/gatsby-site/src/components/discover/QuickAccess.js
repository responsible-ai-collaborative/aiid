import React from 'react';
import styled from 'styled-components';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
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

export default function DiscoverQuickAccess({ className }) {
  return (
    <Wrapper className={`${className} p-4 md:bg-text-light-gray h-24`}>
      <LocalizedLink
        to="/apps/discover"
        className="fs-5 tw-btn text-center shadow w-1/2 h-16 bg-white hover:bg-primary-blue hover:text-white"
      >
        <div className="text-2xl">
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <div className="-mt-1">
          <Trans>Discover</Trans>
        </div>
      </LocalizedLink>
      <LocalizedLink
        to="/apps/submit"
        className="ml-3 fs-5 pb-2 tw-btn text-center shadow w-1/2 h-16  bg-white hover:bg-primary-blue hover:text-white"
      >
        <div className="text-2xl">
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <div className="-mt-1">
          <Trans>Submit</Trans>
        </div>
      </LocalizedLink>
    </Wrapper>
  );
}
