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
    <Wrapper
      className={`${className} ${
        isCollapsed ? 'opacity-0 h-0 p-0 m-0' : 'p-4 h-24'
      } md:bg-text-light-gray transition-all duration-500 opacity-1`}
    >
      <LocalizedLink
        to="/apps/discover"
        className={`fs-5 border-1 border-transparent rounded cursor-pointer inline-block text-base font-normal text-center no-underline select-none align-middle transition-btn shadow w-1/2 ${
          isCollapsed ? 'py-1 px-1' : 'pb-2 py-1.5 px-2 h-16'
        }  bg-white hover:bg-blue-700 hover:text-white`}
      >
        <div className={`${isCollapsed ? '' : 'text-2xl'}`}>
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <div
          className={`${
            isCollapsed ? 'w-0 h-0 opacity-0' : 'opacity-1'
          } -mt-1 transition-opacity duration-1000`}
        >
          {!isCollapsed && <Trans>Discover</Trans>}
        </div>
      </LocalizedLink>
      <LocalizedLink
        to="/apps/submit"
        className={`ml-3 fs-5 border-1 border-transparent rounded cursor-pointer inline-block text-base font-normal text-center no-underline select-none align-middle transition-btn shadow w-1/2 ${
          isCollapsed ? 'py-1 px-1' : 'pb-2 py-1.5 px-2 h-16'
        }  bg-white hover:bg-blue-700 hover:text-white`}
      >
        <div className={`${isCollapsed ? '' : 'text-2xl'}`}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <div
          className={`${
            isCollapsed ? 'w-0 h-0 opacity-0' : 'opacity-1'
          } -mt-1 transition-opacity duration-1000`}
        >
          {!isCollapsed && <Trans>Submit</Trans>}
        </div>
      </LocalizedLink>
    </Wrapper>
  );
}
