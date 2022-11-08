import React, { useEffect, useState } from 'react';
import Tree from './tree';
import { ExternalLink } from 'react-feather';
import config from '../../../config';
import QuickAccess from 'components/discover/QuickAccess';
import { Trans, useTranslation } from 'react-i18next';
import LoginSignup from 'components/loginSignup';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { faChevronCircleLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';
import { useUserContext } from 'contexts/userContext';
import { useMenuContext } from 'contexts/MenuContext';

const Sidebar = ({ defaultCollapsed = false }) => {
  const localizePath = useLocalizePath();

  const { t } = useTranslation();

  const { user } = useUserContext();

  const { isCollapsed, collapseMenu } = useMenuContext();

  const [collapsedMenu, setCollapsedMenu] = useState(isCollapsed || defaultCollapsed);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (defaultCollapsed) {
      setCollapsedMenu(true);
    }
    if (isMobile) {
      setCollapsedMenu(false);
    }
  }, [isMobile]);

  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768 && !isMobile) {
        setIsMobile(true);
      } else if (window.innerWidth > 768 && isMobile) {
        setIsMobile(false);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  console.log(collapsedMenu);

  return (
    <>
      <aside
        className={`${
          !collapsedMenu ? 'md:w-64' : 'md:w-20'
        } sticky relative top-0 transition-width duration-500`}
        aria-label="Sidebar"
      >
        <span>
          <QuickAccess isCollapsed={collapsedMenu} />
        </span>
        {config.sidebar.title ? (
          <div
            className={'tw-hidden-mobile'}
            dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
          />
        ) : null}
        <div
          className={`${
            collapsedMenu ? 'overflow-hidden' : 'overflow-y-auto'
          } pb-4 pt-2 px-3 bg-gray-50 rounded dark:bg-gray-800`}
        >
          <ul className="space-y-2 list-none">
            <Tree
              setNavCollapsed={() => {}}
              isCollapsed={collapsedMenu}
              localizePath={localizePath}
            />
            {config.sidebar.links && config.sidebar.links?.length > 0 && (
              <li className="tw-li-divider">
                <hr />
              </li>
            )}
            {config.sidebar.links?.map((link, key) => {
              if (link.link !== '' && link.text !== '') {
                return (
                  <li className={'side-bar-links'} key={key}>
                    <a href={link.link} className={``} target="_blank" rel="noopener noreferrer">
                      <Trans>{link.text}</Trans>
                      <ExternalLink size={14} />
                    </a>
                  </li>
                );
              }
            })}
          </ul>
          <div className="flex items-center justify-center w-full px-2 py-3 border-t">
            {collapsedMenu ? (
              <Link
                to={user && user.isLoggedIn && user.profile.email ? '/account' : '/login'}
                className={`flex rounded-lg items-center text-base font-normal group ${
                  collapsedMenu ? 'justify-center' : ''
                }`}
              >
                <FontAwesomeIcon
                  className={`w-6 h-6 text-gray-500' transition duration-75 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-white pointer fa mr-1`}
                  fixedWidth
                  icon={faUser}
                  title=""
                />
              </Link>
            ) : (
              <LoginSignup />
            )}
          </div>
          <FontAwesomeIcon
            icon={faChevronCircleLeft}
            color={'white'}
            className={`hidden md:inline-block transition-rotate-180 duration-500 cursor-pointer fa fa-twitter-square fa-lg text-light-orange hover:text-gray-500 w-8 h-8 absolute  ${
              collapsedMenu ? 'rotate-180 left-5 top-9' : '-right-5 top-9'
            }`}
            title={isCollapsed ? t('Expand') : t('Collapse')}
            onClick={() => {
              collapseMenu(!collapsedMenu), setCollapsedMenu(!collapsedMenu);
            }}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
