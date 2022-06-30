import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare, faGithubSquare } from '@fortawesome/free-brands-svg-icons';

import Link from './Link';
import config from '../../../config.js';

import Sidebar from '../sidebar';

const SkipToContent = styled.a`
  color: white;
  background-color: #001934;
  position: relative;
  order: 1;
  margin-left: auto;
  opacity: 0;
  width: 0px;
  height: 0px;
  overflow: hidden;
  :focus {
    opacity: 1;
    padding: 0ch 1ch;
    width: unset;
    height: unset;
  }
  @media (max-width: 767px) {
    font-size: 12px !important;
  }
`;

const NavBarHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .navbarHeader {
    order: 0;
  }
  .divider {
    width: 1px;
  }
  .navBarBrand > * {
    flex-shrink: 0;
  }
  .navBarBrand > .headerTitle {
    flex-shrink: 1;
  }
`;

const HeaderIconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  order: 2;
  .paddingAround {
    padding-right: 10px;
  }
`;

const HideOnDesktop = styled.div`
  @media (min-width: 767px) {
    display: none;
  }
`;

const StarsCount = (props) => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!count) {
      fetch('https://api.github.com/repos/' + props.repo)
        .then((res) => res.json())
        .then((json) => {
          setCount(json['stargazers_count']);
        });
    }
  });
  return (
    <a
      target="_blank"
      className={props.className}
      href={'https://github.com/' + props.repo + '/stargazers'}
      style={{
        color: 'white',
        marginLeft: '3px',
        marginRight: '8px',
        width: '2em',
        marginTop: '-2px',
        display: 'inline-block',
        textDecoration: 'none',
      }}
      rel="noreferrer"
    >
      {count ? '★' + count : ''}
    </a>
  );
};

const Header = () => {
  const logoImg = require('../images/logo.svg');

  const [navCollapsed, setNavCollapsed] = useState(true);

  const topClass = navCollapsed ? 'topnav' : 'topnav responsive ';

  return (
    <StaticQuery
      query={graphql`
        query headerTitleQuery {
          site {
            siteMetadata {
              headerTitle
              githubUrl
              helpUrl
              tweetText
              logo {
                link
                image
                mobile
              }
              headerLinks {
                link
                text
              }
            }
          }
        }
      `}
      render={(data) => {
        const {
          site: {
            siteMetadata: { headerTitle, githubUrl, logo, headerLinks },
          },
        } = data;

        const finalLogoLink = logo.link !== '' ? logo.link : 'https://incidentdatabase.ai/';

        return (
          <div>
            <nav className={'navBarDefault'}>
              <NavBarHeaderContainer>
                <SkipToContent href="#content">Skip to Content</SkipToContent>
                <div className={'navBarHeader'}>
                  <Link to={finalLogoLink} className={'navBarBrand'}>
                    <img
                      id="desktopLogo"
                      className={'hiddenMobile'}
                      style={{ width: 200 }}
                      src={logo.image !== '' ? logo.image : logoImg}
                      alt={'logo'}
                    />
                    <HideOnDesktop>
                      <img
                        style={{ width: 50 }}
                        src={logo.mobile !== '' ? logo.mobile : logoImg}
                        alt={'logo'}
                      />
                    </HideOnDesktop>
                    <div className="divider hiddenMobile"></div>
                    <div
                      className={'headerTitle displayInline'}
                      dangerouslySetInnerHTML={{ __html: headerTitle }}
                    />
                  </Link>
                </div>
                <HeaderIconsContainer>
                  <li className="divider hiddenMobile"></li>
                  {config.header.social && (
                    <a
                      className="paddingAround"
                      href={'https://twitter.com/IncidentsDB'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faTwitterSquare}
                        color={'white'}
                        className="pointer fa fa-twitter-square fa-lg"
                        title="Open Twitter"
                      />
                    </a>
                  )}
                  <a
                    className="paddingAround hiddenMobile"
                    href={'/rss.xml'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faRssSquare}
                      color={'white'}
                      className="pointer fa fa-rss-square fa-lg"
                      title="Open RSS Feed"
                    />
                  </a>
                  {config.header.social && (
                    <>
                      <a
                        className="paddingAround hiddenMobile"
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ paddingRight: '0px' }}
                      >
                        <FontAwesomeIcon
                          icon={faGithubSquare}
                          color={'white'}
                          className="pointer fa fa-github-square fa-lg"
                          title="Open GitHub"
                        />
                      </a>
                      <StarsCount
                        className="hiddenMobile"
                        repo={githubUrl.replace('https://github.com/', '')}
                      />
                    </>
                  )}
                  <HideOnDesktop>
                    <FontAwesomeIcon
                      icon={faBars}
                      color={'white'}
                      className="pointer fa fa-BARS fa-lg"
                      style={{ cursor: 'pointer' }}
                      title="Open Menu"
                      onClick={() => setNavCollapsed(!navCollapsed)}
                    />
                  </HideOnDesktop>
                </HeaderIconsContainer>
              </NavBarHeaderContainer>
              <div id="navbar" className={topClass}>
                <div className={'visibleMobile'}>
                  <Sidebar setNavCollapsed={setNavCollapsed} />
                  <hr />
                </div>
                <ul className={'navBarUL navBarNav navBarULRight'}>
                  {headerLinks.map((link, key) => {
                    if (link.link !== '' && link.text !== '') {
                      return (
                        <li key={key}>
                          <a
                            className="sidebarLink"
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            dangerouslySetInnerHTML={{ __html: link.text }}
                          />
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            </nav>
          </div>
        );
      }}
    />
  );
};

export default Header;
