import React from 'react';
import styled from 'styled-components';

import config from '../../config.js';
import Header from './ui/Header';
import SidebarLayout from './sidebar';
import Footer from './layout/Footer';

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

const LayoutHideSidebar = ({ children, className = '' }) => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <Wrapper className={className}>
        <div className={`tw-hidden-mobile z-2`}>
          <SidebarLayout defaultCollapsed={true} />
        </div>
        {config.sidebar.title ? (
          <div
            className={'sidebarTitle sideBarShow'}
            dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
          />
        ) : null}
        <Content id="content" className="overflow-y-auto max-w-full">
          <MaxWidth>{children}</MaxWidth>
        </Content>
      </Wrapper>
      <Footer />
    </div>
  );
};

export default LayoutHideSidebar;
