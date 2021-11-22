import React from 'react';
import styled from '@emotion/styled';

import Sidebar from './sidebar';
import RightSidebar from './rightSidebar';
import config from '../../config.js';
import Footer from './layout/Footer';

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.background};

  .sideBarUL li a {
    color: ${({ theme }) => theme.colors.text};
  }

  .sideBarUL .item > a:hover {
    background-color: var(--primary3);
    color: #fff !important;

    /* background: #F8F8F8 */
  }

  @media only screen and (max-width: 767px) {
    display: block;
  }
`;

const Content = styled('main')`
  display: flex;
  flex-grow: 1;
  margin: 0px 33px;
  padding-top: 3rem;
  background: ${({ theme }) => theme.colors.background};

  table tr {
    background: ${({ theme }) => theme.colors.background};
  }

  @media only screen and (max-width: 1123px) {
    padding-left: 0;
    margin: 0 10px;
    padding-top: 3rem;
  }
`;

const MaxWidth = styled('div')`
  @media only screen and (max-width: 50rem) {
    width: 100%;
    position: relative;
  }
`;

const LeftSideBarWidth = styled('div')`
  width: 298px;
  ${({ collapse }) => collapse && `width: 0;`}
`;

const RightSideBarWidth = styled('div')`
  width: 224px;

  @media (max-width: 965px) {
    display: none;
  }
`;

const Layout = ({ children, collapse, className, location }) => (
  <>
    <Wrapper>
      <LeftSideBarWidth className={'hiddenMobile'} collapse={collapse}>
        <Sidebar collapse={collapse} />
      </LeftSideBarWidth>
      {config.sidebar.title && (
        <div
          className={'sidebarTitle sideBarShow'}
          dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
        />
      )}
      <Content>
        <MaxWidth className={className}>{children}</MaxWidth>
      </Content>
      <RightSideBarWidth className={'hiddenMobile'}>
        <RightSidebar location={location} />
      </RightSideBarWidth>
    </Wrapper>
    <Footer />
  </>
);

export default Layout;
