import React from 'react';
import Tree from './tree';
import { ExternalLink } from 'react-feather';
import config from '../../../config';
import QuickAccess from 'components/discover/QuickAccess';
import { Trans } from 'react-i18next';
import LoginSignup from 'components/loginSignup';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { faChevronCircleLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';
import { useUserContext } from 'contexts/userContext';
import { useMenuContext } from 'contexts/MenuContext';

const NewSidebarLayout = () => {
  const localizePath = useLocalizePath();

  const { user } = useUserContext();

  const { isCollapsed, collapseMenu } = useMenuContext();

  return (
    <>
      <aside
        className={`${!isCollapsed ? 'w-64' : 'w-20'} sticky top-0 transition-width duration-1000`}
        aria-label="Sidebar"
      >
        <FontAwesomeIcon
          icon={faChevronCircleLeft}
          color={'white'}
          className={`transition-rotate-180 duration-500 cursor-pointer fa fa-twitter-square fa-lg text-gray-300 w-8 h-8 absolute -right-4 top-1/2 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
          title="Open Twitter"
          onClick={collapseMenu}
        />
        <span className={``}>
          <QuickAccess isCollapsed={isCollapsed} />
        </span>
        {config.sidebar.title ? (
          <div
            className={'tw-hidden-mobile'}
            dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
          />
        ) : null}
        <div
          className={`${
            isCollapsed ? 'overflow-hidden' : 'overflow-y-auto'
          } py-4 px-3 bg-gray-50 rounded dark:bg-gray-800`}
        >
          <ul className="space-y-2 list-none">
            <Tree
              setNavCollapsed={() => {}}
              isCollapsed={isCollapsed}
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
            {isCollapsed ? (
              <Link
                to={user && user.isLoggedIn && user.profile.email ? '/account' : '/login'}
                className={`flex rounded-lg items-center text-base font-normal group ${
                  isCollapsed ? 'justify-center' : ''
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
        </div>
      </aside>
    </>
  );
};

export default NewSidebarLayout;
