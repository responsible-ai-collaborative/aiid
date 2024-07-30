import React, { useState } from 'react';
import HeadContent from 'components/HeadContent';
import { Button } from 'flowbite-react';

import { Trans, useTranslation } from 'react-i18next';

const MissingTranslations = ({ pageContext }) => {
  const { missingTranslations, allLocales } = pageContext;

  const missing = [];

  for (const file of Object.keys(missingTranslations)) {
    for (const key of Object.keys(missingTranslations[file])) {
      const localesWithTranslations = Object.keys(missingTranslations[file][key]);

      const localesMissingTranslations = allLocales.filter(
        (locale) => !localesWithTranslations.includes(locale)
      );

      const nonEnglishLocalesMissingTranslations = localesMissingTranslations.filter(
        (e) => e != 'en'
      );

      if (nonEnglishLocalesMissingTranslations.length > 0) {
        missing.push({
          file: file,
          translationKey: key,
          translations: missingTranslations[file][key],
          missingLocales: nonEnglishLocalesMissingTranslations,
        });
      }
    }
  }

  const [shownLocale, setShownLocale] = useState('all');

  return (
    <>
      <div className="titleWrapper">
        <h1>
          <Trans>Translations</Trans>
        </h1>
      </div>

      <div className="styled-main-wrapper">
        <label htmlFor="missing-locale-selector">Show translation keys missing locale </label>
        <select
          id="missing-locale-selector"
          onChange={(event) => setShownLocale(event.target.value)}
        >
          <option value="all">any</option>
          {allLocales
            .filter((l) => l != 'en')
            .map((locale) => (
              <option key={locale} value={locale}>
                {locale}
              </option>
            ))}
        </select>

        {missing
          .filter((e) => shownLocale == 'all' || e.missingLocales.includes(shownLocale))
          .map((e) => {
            return (
              <>
                <table
                  key={e.locale + e.file + e.translationKey}
                  className="
                w-full
                my-6
                [&_tr>*]:border-1
                [&_tr>*]:border-gray-200
                [&_tr>*]:py-2
                [&_tr>*]:px-4
                [&_th]:text-left
                [&_th]:bg-gray-50
              "
                >
                  <tr>
                    <th className="w-1/4">File</th>
                    <td className="font-mono">{e.file}</td>
                  </tr>
                  <tr>
                    <th>Key</th>
                    <td>
                      <div className="inline-block float-right ml-1">
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(`,\n  "${e.translationKey}": ""`).then(
                              function () {
                                window.alert('Copied');
                              },
                              function (error) {
                                window.alert('Could not copy');
                                console.error(error);
                              }
                            );
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <span className="font-mono">&quot;{e.translationKey}&quot;</span>
                    </td>
                  </tr>
                  <tr>
                    <th>Missing Locales</th>
                    <td>{e.missingLocales.join(', ')}</td>
                  </tr>
                  <tr>
                    <th>Existing Translations</th>
                    <td>
                      <table className="w-full my-2">
                        {Object.keys(e.translations).map((locale) => (
                          <tr key={locale}>
                            <th>{locale}</th>
                            <td className="font-mono whitespace-pre-wrap">
                              {JSON.stringify(e.translations[locale], null, 2)}
                            </td>
                          </tr>
                        ))}
                      </table>
                    </td>
                  </tr>
                </table>
              </>
            );
          })}
      </div>
    </>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation();

  const metaTitle = t('Missing Translations');

  const metaDescription = t('Help us fill in missing translations');

  return <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaDescription} />;
};

export default MissingTranslations;
