import useLocalizePath from 'components/i18n/useLocalizePath';
import { navigate } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Form from '../../elements/Form';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from 'flowbite-react';

export default function QuickSearch() {
  const [searchTerm, setSearchTerm] = useState('');

  const [searchPlaceholder, setSearchPlaceholder] = useState('');

  const setInnerText = () => {
    const width = window.innerWidth;

    if (width >= 350 && width < 450) {
      setSearchPlaceholder(t('Search 2000+ reports'));
    } else if (width >= 450 && width < 500) {
      setSearchPlaceholder(t('Search 2000+ AI harm reports'));
    } else if (width >= 500) {
      setSearchPlaceholder(t('Search over 2000 reports of AI harms'));
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
            aria-label={t('Search over 1800 reports of AI harms')}
          />
        </div>
        <div className="flex flex-row items-center justify-center mt-4 md:mt-6 gap-2">
          <Button type="submit">
            <Trans>Search</Trans>
          </Button>
          <Button color={'gray'} onClick={discover}>
            <Trans>Discover</Trans>
          </Button>
        </div>
      </Form>
    </div>
  );
}
