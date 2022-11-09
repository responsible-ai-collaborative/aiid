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
        isCollapsed ? 'opacity-0' : 'opacity-1  duration-700 ease-in'
      } transition-opacity px-4 pt-4 pb-1 md:bg-text-light-gray h-24 relative z-10`}
    >
      <div className="absolute flex items-center justify-center top-3 bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="w-10 h-10 bg-text-light-gray rounded-full shadow-inner pointer-events-auto hidden md:block"></div>
      </div>
      <LocalizedLink
        to="/apps/discover"
        className={`fs-5 border-1 border-transparent rounded-l-lg cursor-pointer inline-block text-base font-normal text-center no-underline select-none align-middle transition-btn shadow w-1/2 ${
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
          <Trans>Discover</Trans>
        </div>
      </LocalizedLink>
      <LocalizedLink
        to="/apps/submit"
        className={`fs-5 border-1 border-transparent rounded-r-lg cursor-pointer inline-block text-base font-normal text-center no-underline select-none align-middle transition-btn shadow w-1/2 ${
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
          <Trans>Submit</Trans>
        </div>
      </LocalizedLink>
    </Wrapper>
  );
}
