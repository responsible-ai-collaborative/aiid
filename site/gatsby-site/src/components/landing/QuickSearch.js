import useLocalizePath from 'components/i18n/useLocalizePath';
import { navigate } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Form from '../../elements/Form';
import { Trans, useTranslation } from 'react-i18next';

export default function QuickSearch() {
  const [searchTerm, setSearchTerm] = useState('');

  const [searchPlaceholder, setSearchPlaceholder] = useState('');

  const setInnerText = () => {
    const width = window.innerWidth;

    if (width >= 350 && width < 450) {
      setSearchPlaceholder(t('Search 1600+ reports'));
    } else if (width >= 450 && width < 500) {
      setSearchPlaceholder(t('Search 1600+ AI harm reports'));
    } else if (width >= 500) {
      setSearchPlaceholder(t('Search over 1600 reports of AI harms'));
    } else {
      setSearchPlaceholder(t('Search reports'));
    }
  };

  useEffect(() => {
    setInnerText();
    window.addEventListener('resize', setInnerText);

    return () => {
      window.removeEventListener('resize', setInnerText);
    };
  }, []);

  const localizePath = useLocalizePath();

  const submit = (e) => {
    e.preventDefault();
    navigate(localizePath({ path: `/apps/discover?s=${searchTerm}` }));
  };

  const discover = (e) => {
    e.preventDefault();
    navigate(localizePath({ path: `/apps/discover` }));
  };

  const { t } = useTranslation(['translation', 'landing', 'actions']);

  return (
    <div className="flex justify-center">
      <Form
        onSubmit={submit}
        id="quickSearch"
        className="flex-1 w-full md:max-w-3xl flex flex-col justify-center items-center"
      >
        <div className="relative w-full">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(ev) => setSearchTerm(ev.target.value)}
            onKeyPress={(e) => {
              e.key === 'Enter' && submit(e);
            }}
            aria-label={t('Search over 1600 reports of AI harms')}
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Trans>Search</Trans>
          </button>
        </div>
        <button
          type="button"
          className="flex-1 mt-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={discover}
        >
          <Trans>Discover</Trans>{' '}
        </button>
      </Form>
    </div>
  );
}
