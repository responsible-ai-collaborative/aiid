import React, { useState } from 'react';
import styled from '@emotion/styled';
import { MDXProvider } from '@mdx-js/react';

import ThemeProvider from './theme/themeProvider';
import mdxComponents from './mdxComponents';
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
    background-color: #1ed3c6;
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
  margin: 0px 88px;
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
  @media only screen and (max-width: 50rem) {
    width: 100%;
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
    collapse === true &&
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

const MiddleLayout = ({ children, location, className }) => {
  const [collapse, setCollapse] = useState(true);

  return (
    <ThemeProvider location={location}>
      <MDXProvider components={mdxComponents}>
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
            <SidebarToggleButton onClick={() => setCollapse(!collapse)} collapse={collapse}>
              MENU
            </SidebarToggleButton>
            <MaxWidth className={className}>{children}</MaxWidth>
          </Content>
        </Wrapper>
      </MDXProvider>
    </ThemeProvider>
  );
};

export default MiddleLayout;
