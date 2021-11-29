import React, { useState } from 'react';
import styled from '@emotion/styled';

import Sidebar from './sidebar';
import config from '../../config.js';
import Button from 'react-bootstrap/Button';

const Wrapper = styled('div')`
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

const MaxWidth = styled('div')`
  width: 100%;

  @media only screen and (max-width: 50rem) {
    max-width: 100%;
    position: relative;
  }

  @media (max-width: 1440px) {
    padding-top: 0;
  }
`;

const LeftSideBarWidth = styled('div')`
  width: 298px;
  ${({ collapse }) => collapse && `width: 0;`}
`;

const SidebarToggleButton = styled(Button)`
  width: 100px;
  height: 40px;
  position: fixed;
  left: 220px;
  ${({ collapse }) =>
    collapse === 'true' &&
    `
      left: -30px;
    `};
  top: 50%;
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);

  @media (max-width: 1440px) {
    right: 41px;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const LayoutHideSidebar = ({ children, location, menuCollapseCallback }) => {
  const [collapse, setCollapse] = useState(true);

  const toggleMenu = () => {
    setCollapse(!collapse);
    if (menuCollapseCallback) {
      menuCollapseCallback(!collapse);
    }
  };

  return (
    <Wrapper>
      <LeftSideBarWidth className={'hiddenMobile'} collapse={collapse}>
        <Sidebar location={location} collapse={collapse} />
      </LeftSideBarWidth>
      {config.sidebar.title ? (
        <div
          className={'sidebarTitle sideBarShow'}
          dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
        />
      ) : null}
      <Content>
        <SidebarToggleButton onClick={() => toggleMenu()} collapse={collapse.toString()}>
          MENU
        </SidebarToggleButton>
        <MaxWidth>{children}</MaxWidth>
      </Content>
    </Wrapper>
  );
};

export default LayoutHideSidebar;
