import React, { useState } from 'react';
import Tree from './tree';
import { ExternalLink } from 'react-feather';
import config from '../../../config';
import QuickAccess from 'components/discover/QuickAccess';
import { Trans } from 'react-i18next';
import LoginSignup from 'components/loginSignup';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NewSidebarLayout = () => {
  const localizePath = useLocalizePath();

  const [isCollapsed, setIsCollapsed] = useState(false);

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
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
        {!isCollapsed && <QuickAccess />}
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
          {!isCollapsed && (
            <div className="flex items-center justify-center w-full p-3 border-t">
              <LoginSignup />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default NewSidebarLayout;
