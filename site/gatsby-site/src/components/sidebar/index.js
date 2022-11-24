import React, { useEffect, useState, useRef } from 'react';
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
      className={`flex rounded-lg p-2 text-base font-normal group overflow-hidden ${
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

  const [headerVisiblePixels, setHeaderVisiblePixels] = useState(80);

  // We want the bottom edge of the sidebar
  // to be at the bottom edge of the viewport.
  // Since the sidebar has `position: sticky`,
  // that means that in the initial view,
  // its height should be 100vh - 80px (the height of the header)
  // Then, when we scroll down, its height should be 100vh.
  // CSS doesn't provide use with a way
  // to detect whether a sticky element is "stuck"
  // so we have to check ourselves with an IntersectionObserver.
  const sidebar = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        setHeaderVisiblePixels(e.boundingClientRect.height * e.intersectionRatio);
      },
      {
        threshold: Array(1000)
          .fill()
          .map((e, i) => i / 1000)
          .concat([1]),
      }
    );

    observer.observe(document.querySelector('nav.navBarDefault'));

    return () => {
      observer.disconnect();
    };
  }, [sidebar]);

  return (
    <>
      <aside
        id="sidebar"
        ref={sidebar}
        className={`
          ${!collapsedMenu ? 'md:w-64' : 'md:w-[3.5rem]'} 
          sticky relative top-0 transition-all duration-500 flex flex-col
        `}
        style={{ height: `calc(100vh - ${headerVisiblePixels}px)` }}
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

        <ul
          className={`space-y-2 list-none z-20 transition-transform duration-500 shrink overflow-auto p-2`}
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
                <li className={'side-bar-links overflow-hidden w-full'} key={key}>
                  <a href={link.link} className={``} target="_blank" rel="noopener noreferrer">
                    <Trans>{link.text}</Trans>
                    <ExternalLink size={14} />
                  </a>
                </li>
              );
            }
          })}
          <li className="side-bar-links justify-center overflow-hidden w-full">
            {isCollapsed ? (
              <span title={isUserLoggedIn ? t('Account') : t('Subscribe')}>{LoginSignupNode}</span>
            ) : (
              <>{LoginSignupNode}</>
            )}
          </li>
        </ul>
        <div className="flex justify-end mt-auto p-3 border-t-2 border-gray-200">
          <FontAwesomeIcon
            icon={faChevronCircleLeft}
            color={'white'}
            className={`hidden md:inline-block transition-transform duration-500 cursor-pointer fa fa-twitter-square fa-lg text-light-orange hover:text-gray-500 w-8 h-8 ${
              collapsedMenu ? 'rotate-180' : ''
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
