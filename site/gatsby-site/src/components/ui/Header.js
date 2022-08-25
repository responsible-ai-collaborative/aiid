import React, { useState, useEffect } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare, faGithubSquare } from '@fortawesome/free-brands-svg-icons';

import Link from './Link';
import config from '../../../config.js';

import Sidebar from '../sidebar';
import LanguageSwitcher from 'components/i18n/LanguageSwitcher';

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
          <nav className={'navBarDefault'}>
            <div className="tw-nav-header-container">
              <a className="tw-skip-to-content" href="#content">
                Skip to Content
              </a>
              <div className={'nav-bar-header'}>
                <Link to={finalLogoLink} className={'nav-bar-brand'}>
                  <img
                    id="desktopLogo"
                    className={'hiddenMobile'}
                    style={{ width: 200 }}
                    src={logo.image !== '' ? logo.image : logoImg}
                    alt={'logo'}
                  />
                  <div className="min-767px:hidden">
                    <img
                      style={{ width: 50 }}
                      src={logo.mobile !== '' ? logo.mobile : logoImg}
                      alt={'logo'}
                    />
                  </div>
                  <div className="divider hiddenMobile"></div>
                  <div
                    className={'headerTitle displayInline'}
                    dangerouslySetInnerHTML={{ __html: headerTitle }}
                  />
                </Link>
              </div>
              <div className="tw-header-icons-container">
                <LanguageSwitcher className="me-3 me-md-0" />
                <li className="divider hiddenMobile"></li>
                {config.header.social && (
                  <a
                    className="paddingAround hiddenMobile"
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
                <div className="min-767px:hidden">
                  <FontAwesomeIcon
                    icon={faBars}
                    color={'white'}
                    className="pointer fa fa-BARS fa-lg"
                    style={{ cursor: 'pointer' }}
                    title="Open Menu"
                    onClick={() => setNavCollapsed(!navCollapsed)}
                  />
                </div>
              </div>
            </div>
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
        );
      }}
    />
  );
};

export default Header;
