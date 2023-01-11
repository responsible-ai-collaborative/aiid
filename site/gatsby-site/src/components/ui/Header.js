import React, { useState, useEffect } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare, faGithubSquare } from '@fortawesome/free-brands-svg-icons';
import LoginSignup from 'components/loginSignup';

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
            }
          }
        }
      `}
      render={(data) => {
        const {
          site: {
            siteMetadata: { headerTitle, githubUrl, logo },
          },
        } = data;

        const finalLogoLink = logo.link !== '' ? logo.link : 'https://incidentdatabase.ai/';

        var SocialMediaIcons = () => (
          <div className="hidden md:flex wrap-0 gap-1 items-center">
            {config.header.social && (
              <a href={'https://twitter.com/IncidentsDB'} target="_blank" rel="noreferrer">
                <FontAwesomeIcon
                  icon={faTwitterSquare}
                  color={'white'}
                  className="pointer fa fa-twitter-square fa-lg"
                  title="Open Twitter"
                />
              </a>
            )}
            <a href={'/rss.xml'} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                icon={faRssSquare}
                color={'white'}
                className="pointer fa fa-rss-square fa-lg"
                title="Open RSS Feed"
              />
            </a>
            {config.header.social && (
              <span className="whitespace-nowrap">
                <a
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
                <StarsCount repo={githubUrl.replace('https://github.com/', '')} />
              </span>
            )}
          </div>
        );

        var HeaderLink = ({ className }) => (
          <Link to={finalLogoLink} className={`flex items-center ${className}`}>
            <img
              className={'hidden md:inline ml-[10px] mr-[10px]'}
              style={{ width: 200 }}
              src={logo.image !== '' ? logo.image : logoImg}
              alt={'logo'}
            />
            <img
              className="md:hidden"
              style={{ width: 50 }}
              src={logo.mobile !== '' ? logo.mobile : logoImg}
              alt={'logo'}
            />
            <Divider />
            <span
              className="inline-block mx-6 font-semibold text-xs  md:text-base md:uppercase"
              dangerouslySetInnerHTML={{ __html: headerTitle }}
            />
          </Link>
        );

        var SkipToContent = ({ className }) => (
          <a
            href="#content"
            className={`
              ${className}
              relative 
              overflow-hidden
              text-white
              bg-transparent 
              text-xs
              opacity-0 focus:opacity-100
              w-0       focus:w-[unset]
              h-0       focus:h-[unset]
                        focus:px-[1ch]   
            `}
          >
            Skip to Content
          </a>
        );

        return (
          <nav id="navBarDefault" className="bg-[#001934] shadow">
            <div className=" text-white flex flex-row items-center w-full p-4 h-[80px]">
              <SkipToContent className="-order-1" />

              <HeaderLink className="-order-3" />

              <div className="mx-auto -order-2" />

              <LanguageSwitcher className="mr-3 md:mr-0" />

              <Divider className="mx-2" />

              <SocialMediaIcons />

              <div className="block md:hidden">
                <FontAwesomeIcon
                  icon={faBars}
                  color={'white'}
                  className="pointer fa fa-BARS fa-lg"
                  style={{ cursor: 'pointer' }}
                  title="Open Menu"
                  onClick={() => setNavCollapsed(!navCollapsed)}
                />
              </div>
              <LoginSignup
                className="hidden lg:flex ml-4"
                logoutClassName="text-white hover:text-primary-blue"
                loginClassName="text-white hover:text-primary-blue"
              />
            </div>
            <div
              id="navbar"
              className={
                navCollapsed
                  ? 'hidden border-none'
                  : 'bg-inherit block md:hidden border-none relative z-10 pb-0'
              }
            >
              <Sidebar />
            </div>
          </nav>
        );
      }}
    />
  );
};

var Divider = ({ className }) => (
  <span className={`divider hidden md:inline-block w-px h-[30px] bg-gray-400 ${className}`} />
);

export default Header;
