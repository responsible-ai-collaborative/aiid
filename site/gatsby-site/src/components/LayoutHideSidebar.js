import React, { useState } from 'react';
import styled from 'styled-components';

import Sidebar from './sidebar';
import config from '../../config.js';
import Header from './ui/Header';
import Button from 'elements/Button';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.background};

  .sideBarUL li a {
    color: ${({ theme }) => theme.colors.text};
  }

  .sideBarUL .item > a:hover {
    background-color: ${({ theme }) => theme.colors.primary3};
    color: #fff !important;

    /* background: #F8F8F8 */
  }

  @media only screen and (max-width: 767px) {
    display: block;
  }
`;

const Content = styled('main')`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  /* margin: 0px 33px; */
  background: ${({ theme }) => theme.colors.background};

  table tr {
    background: ${({ theme }) => theme.colors.background};
  }

  @media only screen and (max-width: 1440px) {
    padding-left: 0;
    margin: 0 0 0 30px;
  }

  @media (max-width: 767px) {
    margin: 1em;
  }
`;

const MaxWidth = styled.div`
  width: 100%;

  @media only screen and (max-width: 50rem) {
    max-width: 100%;
    position: relative;
  }

  @media (max-width: 1440px) {
    padding-top: 0;
  }
`;

const LeftSideBarWidth = styled.div`
  width: 298px;
  ${({ collapse }) => collapse && `width: 0;`}
`;

const LayoutHideSidebar = ({ children, location, menuCollapseCallback, className = '' }) => {
  const [collapse, setCollapse] = useState(true);

  const toggleMenu = () => {
    setCollapse(!collapse);
    if (menuCollapseCallback) {
      menuCollapseCallback(!collapse);
    }
  };

  return (
    <>
      <Header />
      <Wrapper className={className}>
        <LeftSideBarWidth className={'hiddenMobile'} collapse={collapse}>
          <Sidebar location={location} collapse={collapse} />
        </LeftSideBarWidth>
        {config.sidebar.title ? (
          <div
            className={'sidebarTitle sideBarShow'}
            dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
          />
        ) : null}
        <Content id="content" className="tw-overflow-y-auto tw-max-w-full">
          <Button
            variant="primary"
            className={`tw-btn-menu ${collapse ? 'collapsed' : ''}`}
            onClick={() => toggleMenu()}
            collapse={collapse.toString()}
          >
            MENU
          </Button>
          <MaxWidth>{children}</MaxWidth>
        </Content>
      </Wrapper>
    </>
  );
};

export default LayoutHideSidebar;
