import React, { useEffect, useState } from 'react';
import Tree from './tree';
import { ExternalLink } from 'react-feather';
import config from '../../../config';
import QuickAccess from 'components/discover/QuickAccess';
import { Trans, useTranslation } from 'react-i18next';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { faChevronCircleLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';
import { useUserContext } from 'contexts/userContext';
import { useMenuContext } from 'contexts/MenuContext';
import { Tooltip } from 'flowbite-react';
import { globalHistory } from '@reach/router';

const Sidebar = ({ defaultCollapsed = false }) => {
  const localizePath = useLocalizePath();

  const { t } = useTranslation();

  const { user } = useUserContext();

  const { isCollapsed, collapseMenu } = useMenuContext();

  const [collapsedMenu, setCollapsedMenu] = useState(isCollapsed || defaultCollapsed);

  const [isMobile, setIsMobile] = useState(false);

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

  const isUserLoggedIn = user && user.isLoggedIn && user.profile.email;

  const isAccountCurrentPath =
    localizePath({ path: globalHistory.location.pathname }) ===
    localizePath({ path: isUserLoggedIn ? '/account' : '/login' });

  const LoginSignupNode = (
    <Link
      to={isUserLoggedIn ? '/account' : '/login'}
      className={`flex rounded-lg items-center p-2 text-base font-normal group ${
        isAccountCurrentPath
          ? 'bg-light-orange text-white dark:bg-gray-700'
          : 'text-gray-900 hover:bg-light-orange dark:text-white  hover:text-white dark:hover:bg-gray-700'
      }`}
    >
      <FontAwesomeIcon
        icon={faUser}
        className={`w-6 h-6 ${
          isAccountCurrentPath ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
      {!isCollapsed && (
        <span>
          <span className="ml-3 block">
            <Trans>{isUserLoggedIn ? 'Account' : 'Subscribe'}</Trans>
          </span>
        </span>
      )}
    </Link>
  );

  // We want the bottom edge of the sidebar
  // to be at the bottom edge of the viewport.
  // Since the sidebar has `position: sticky`,
  // that means that in the initial view,
  // its height should be:
  //
  //   100vh - the height of the header
  //
  // Then, when we scroll down, its height should be 100vh.
  // CSS doesn't provide use with a way
  // to detect whether a sticky element is "stuck"
  // so we have to check ourselves with an IntersectionObserver.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        console.log('intersect');
        console.log(e);
        e.target.classList.toggle('h-[100vh]');
      },
      { threshold: [1] }
    );

    observer.observe(document.querySelector('#sidebar'));

    return () => {
      observer.disconnect();
    };
  });

  return (
    <>
      <aside
        id="sidebar"
        className={`${
          !collapsedMenu ? 'md:w-64' : 'md:w-20'
        } sticky relative top-0 transition-width duration-500`}
        aria-label="Sidebar"
      >
        <FontAwesomeIcon
          icon={faChevronCircleLeft}
          color={'white'}
          className={`hidden md:inline-block transition-transform duration-500 cursor-pointer fa fa-twitter-square fa-lg text-light-orange hover:text-gray-500 w-8 h-8 fixed bottom-5 ${
            collapsedMenu ? 'rotate-180 translate-x-1' : 'translate-x-48'
          }`}
          title={isCollapsed ? t('Expand') : t('Collapse')}
          onClick={() => {
            collapseMenu(!collapsedMenu), setCollapsedMenu(!collapsedMenu);
          }}
        />
        <span>
          <QuickAccess isCollapsed={collapsedMenu} />
        </span>
        {config.sidebar.title ? (
          <div
            className={'tw-hidden-mobile'}
            dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
          />
        ) : null}

        <ul
          className={`${
            collapsedMenu ? '-translate-y-16' : ''
          } space-y-2 list-none z-20 transition-transform duration-500`}
        >
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
          <li className="border-t pt-2">
            {isCollapsed ? (
              <Tooltip content={isUserLoggedIn ? t('Account') : t('Subscribe')}>
                {LoginSignupNode}
              </Tooltip>
            ) : (
              <>{LoginSignupNode}</>
            )}
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
