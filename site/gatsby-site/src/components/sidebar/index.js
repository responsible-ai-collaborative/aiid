import React, { useEffect, useState } from 'react';
import Tree from './tree';
import { ExternalLink } from 'react-feather';
import config from '../../../config';
import QuickAccess from 'components/discover/QuickAccess';
import { Trans, useTranslation } from 'react-i18next';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserContext } from 'contexts/userContext';
import { useMenuContext } from 'contexts/MenuContext';

const Sidebar = ({ defaultCollapsed = false }) => {
  const localizePath = useLocalizePath();

  const { t } = useTranslation();

  const { user } = useUserContext();

  const { isCollapsed, collapseMenu, manual, setManual } = useMenuContext();

  const [isMobile, setIsMobile] = useState(false);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    if (!manual) {
      collapseMenu(defaultCollapsed);
    }
    if (isMobile) {
      collapseMenu(false);
      setManual(false);
    }
  }, [isMobile]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768 && !isMobile) {
        setIsMobile(true);
      } else if (window.innerWidth >= 768 && isMobile) {
        setIsMobile(false);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setIsUserLoggedIn(!!user?.profile.email);
  }, [user]);

  // We want the bottom edge of the sidebar
  // to rest at bottom edge of the viewport.
  // Since the sidebar has `position: sticky`,
  // that means that in the initial view,
  // its height should be 100vh - (the visible height of the header)
  // Then, when we scroll down, its height should be 100vh.
  // There's no way to do this in pure CSS
  // so we have to check ourselves with an IntersectionObserver.
  const [headerVisiblePixels, setHeaderVisiblePixels] = useState(80);

  const threshold = Array(1000)
    .fill()
    .map((e, i) => i / 1000)
    .concat([1]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        const h = e.target.getBoundingClientRect();

        setHeaderVisiblePixels(
          window.innerWidth > 768 ? h.height + Math.max(h.top, -h.height) : null
        );
      },
      { threshold }
    );

    observer.observe(document.querySelector('#navBarDefault'));
    return () => observer.disconnect();
  }, []);

  // When we've scrolled to where the footer is visible,
  // the collapse button should no longer be at the bottom of the viewport,
  // so we need to unset `position: fixed`.
  // This can result in the collapse button flashing into view,
  // but that seems to be the least objectionable option.
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => setAtBottom(e.isIntersecting), {
      threshold,
    });

    observer.observe(document.querySelector('#main-footer'));
    return () => observer.disconnect();
  }, []);

  const sidebarWidth = !isCollapsed ? 'md:w-64' : 'md:w-[3.5rem]';

  return (
    <>
      <aside
        id="sidebar"
        aria-label="Sidebar"
        className={`${sidebarWidth} sticky top-0 flex flex-col md:bg-text-light-gray`}
        style={{
          height:
            (headerVisiblePixels && !isMobile) || window.innerWidth > 768
              ? `calc(100vh - ${headerVisiblePixels}px)`
              : undefined,
          transition: 'width 500ms ease, height 75ms ease',
        }}
      >
        <span className="md:border-b-1 md:border-b-gray-200">
          <QuickAccess isCollapsed={isCollapsed} />
        </span>

        <ul
          id="sidebar-tree"
          data-cy="sidebar-tree"
          className={`space-y-2 shrink list-none overflow-auto p-2 md:mb-12`}
        >
          <Tree
            setNavCollapsed={() => {}}
            isCollapsed={isCollapsed}
            localizePath={localizePath}
            additionalNodes={[
              {
                label: 'user',
                url: isUserLoggedIn ? '/account' : '/signup',
                title: isUserLoggedIn ? 'Account' : 'Subscribe',
                items: [],
              },
            ]}
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
        </ul>
        {!isMobile && (
          <div
            className={`
              ${sidebarWidth} h-12
              flex justify-end items-center
              transition-all duration-500
              border-t-1 border-gray-200
              bg-text-light-gray z-40
              ${atBottom ? 'absolute' : 'fixed'} bottom-0
              ${isCollapsed ? '' : 'pr-3'}
            `}
          >
            <FontAwesomeIcon
              data-cy="collapse-button"
              icon={faChevronLeft}
              color={'white'}
              titleId="collapse"
              className={`
                w-6 h-6
                hidden md:inline-block 
                cursor-pointer fa
                text-gray-500
                hover:text-gray-200 
                ${isCollapsed ? 'rotate-180 -translate-x-3' : ''}
                transition-transform duration-500 
              `}
              title={isCollapsed ? t('Expand') : t('Collapse')}
              onClick={() => {
                // If the user, e.g. from the landing page
                // collapses the sidebar and then uncollapses it,
                // navigating to /discover
                // should still cause the sidebar to collapse.
                // However, when changing the collapsed state
                // to one that is not its default value,
                // that state should be preserved across pages.
                setManual(defaultCollapsed == isCollapsed);

                collapseMenu(!isCollapsed);
              }}
            />
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
