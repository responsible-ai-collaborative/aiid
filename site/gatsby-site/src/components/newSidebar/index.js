import React from 'react';
import Tree from './tree';
import { ExternalLink } from 'react-feather';
import config from '../../../config';
import QuickAccess from 'components/discover/QuickAccess';
import { Trans } from 'react-i18next';
import LoginSignup from 'components/loginSignup';
import useLocalizePath from 'components/i18n/useLocalizePath';

const NewSidebarLayout = ({ collapse = false, setNavCollapsed }) => {
  const localizePath = useLocalizePath();

  return (
    <>
      <aside
        className={`w-64 sticky top-0 ${collapse ? 'TODO:do something' : ''}`}
        aria-label="Sidebar"
      >
        <QuickAccess />
        {config.sidebar.title ? (
          <div
            className={'tw-hidden-mobile'}
            dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
          />
        ) : null}
        <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
          <ul className="space-y-2 list-none">
            <Tree setNavCollapsed={setNavCollapsed} localizePath={localizePath} />
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
          <div className="flex items-center justify-center w-full p-3 border-t">
            <LoginSignup />
          </div>
        </div>
      </aside>
    </>
  );
};

export default NewSidebarLayout;
