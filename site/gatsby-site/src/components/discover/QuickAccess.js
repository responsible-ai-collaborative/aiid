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
    color: #001934 !important;
  }
`;

export default function DiscoverQuickAccess({ className = '', isCollapsed = false }) {
  return (
    <Wrapper className={`${className} p-4 md:bg-text-light-gray h-24`}>
      <LocalizedLink
        to="/apps/discover"
        className={`fs-5 bg-transparent border-1 border-transparent rounded cursor-pointer inline-block text-base font-normal text-center no-underline select-none align-middle transition-btn shadow w-1/2 ${
          isCollapsed ? 'px-1 py-1' : 'px-2 py-1.5 h-16'
        } bg-white hover:bg-blue-700 hover:text-white`}
      >
        <div className={`${isCollapsed ? '' : 'text-2xl'}`}>
          <FontAwesomeIcon icon={faSearch} />
        </div>
        {!isCollapsed && (
          <div className="-mt-1">
            <Trans>Discover</Trans>
          </div>
        )}
      </LocalizedLink>
      <LocalizedLink
        to="/apps/submit"
        className={`ml-3 fs-5 bg-transparent border-1 border-transparent rounded cursor-pointer inline-block text-base font-normal text-center no-underline select-none align-middle transition-btn shadow w-1/2 ${
          isCollapsed ? 'py-1 px-1' : 'pb-2 py-1.5 px-2 h-16'
        }  bg-white hover:bg-blue-700 hover:text-white`}
      >
        <div className={`${isCollapsed ? '' : 'text-2xl'}`}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
        {!isCollapsed && (
          <div className="-mt-1">
            <Trans>Submit</Trans>
          </div>
        )}
      </LocalizedLink>
    </Wrapper>
  );
}
