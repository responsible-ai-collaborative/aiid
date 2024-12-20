import React from 'react';
import HeadContent from 'components/HeadContent';
import { Trans, useTranslation } from 'react-i18next';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const bgByLocale = { es: 'bg-yellow-100', fr: 'bg-blue-100', ja: 'bg-green-100', en: 'bg-red-100' };

export default function MissingTranslations({ pageContext }) {
  const { translationEntries, allLocales } = pageContext;

  const nonEnglishLocales = new FunctionalSet(pageContext.allLocales).filter(
    (locale) => locale != 'en'
  );

  // e.g. { Hello: ["translation.json", "greetings.json"] }
  const keyFilesMap = recursiveMap(translationEntries, ['key', 'file']);

  // e.g. { Hello: { fr: { "translation.json": "Bonjour" } } }
  const klft = recursiveMap(translationEntries, ['key', 'locale', 'file', 'translation'], true);

  const allKeys = getKeys(klft);

  const keysWithMissingTranslations = allKeys.filter((key) =>
    nonEnglishLocales.some((locale) => !klft[key][locale])
  );

  const translatedKeyCountByLocale = {};

  for (const key of allKeys) {
    for (const locale of nonEnglishLocales) {
      translatedKeyCountByLocale[locale] ||= 0;
      if (klft[key][locale]) {
        translatedKeyCountByLocale[locale] += 1;
      }
    }
  }

  const localeSlashFileToMissingKeysMap = {};

  for (const key of keysWithMissingTranslations) {
    for (const file of keyFilesMap[key]) {
      for (const locale of nonEnglishLocales) {
        if (!klft[key][locale] || !klft[key][locale][file]) {
          localeSlashFileToMissingKeysMap[locale + '/' + file] ||= new FunctionalSet();
          localeSlashFileToMissingKeysMap[locale + '/' + file].add(key);
        }
      }
    }
  }

  const keysWithFileDiscrepancies = allKeys.filter((key) => {
    // e.g. [ 'es', 'fr', 'jp']
    const localesForKey = getKeys(klft[key]);

    // e.g. [
    //   ['translation.json', 'submit.json],
    //   ['translation.json'],                <- Doesn't match, so is disrepency
    //   ['translation.json', 'submit.json]
    // ]
    const listsOfFilesWithTranslations = localesForKey.map((locale) => getKeys(klft[key][locale]));

    return !FunctionalSet.allEqual(listsOfFilesWithTranslations);
  });

  return (
    <div>
      <div className={'titleWrapper'}>
        <h1>
          <Trans>Site i18n Overview</Trans>
        </h1>
      </div>
      <div className="flex gap-16 my-8">
        {getKeys(translatedKeyCountByLocale).map((locale) => (
          <div className="text-center" key={locale}>
            <div
              className="text-2xl h-24 w-24 rounded-full inline-flex margin-auto items-center justify-center mb-4"
              style={{
                background: `
                  radial-gradient(closest-side, white 79%, transparent 80% 100%),
                  conic-gradient(${
                    {
                      es: 'rgb(202 138 4)',
                      fr: 'rgb(37 99 235)',
                      ja: 'rgb(22 163 74)',
                      en: 'rgb(220 38 38)',
                    }[locale]
                  } ${Math.round(
                  (100 * translatedKeyCountByLocale[locale]) / allKeys.size
                )}%, rgb(209 213 219) 0)
                `,
              }}
            >
              <div>{locale}</div>
            </div>
            <div className="text-xl">
              <span
                className={
                  {
                    es: 'text-yellow-600',
                    fr: 'text-blue-600',
                    ja: 'text-green-600',
                    en: 'text-red-600',
                  }[locale]
                }
              >
                {translatedKeyCountByLocale[locale]}
              </span>{' '}
              / {allKeys.size}
            </div>
            <div className="text-gray-600">keys translated</div>
          </div>
        ))}
      </div>
      <h2>Discrepancies</h2>
      Found <strong>{keysWithFileDiscrepancies.size}</strong> discrepancies. These are cases where a
      key is translated in every locale, but the files where the translations appear differ by
      locale.
      <div className="flex flex-wrap gap-2">
        {keysWithFileDiscrepancies.map((key) => (
          <div key={key} className="p-4 flex items-center justify-center">
            <div>
              <table>
                <tr>
                  <th></th>
                  {allLocales.map((locale) => (
                    <th key={locale} className="p-2 border-1 bg-gray-100">
                      {locale}
                    </th>
                  ))}
                </tr>
                {keyFilesMap[key].map((file) => (
                  <tr key={file}>
                    <th className="p-2 border-1  bg-gray-100">{file}</th>
                    {allLocales.map((locale) => {
                      const translation = klft[key][locale] && klft[key][locale][file];

                      return (
                        <td
                          key={locale}
                          className={`border-1 p-2 text-center ${
                            translation ? 'bg-green-300' : 'bg-white'
                          }`}
                          title={translation}
                        >
                          {translation ? 'x' : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </table>
              <div className="mt-4 text-center">
                <code>&quot;{key}&quot;</code>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-4 mb-8">Missing Translations By File</h2>
      <table className="w-full">
        {Object.keys(localeSlashFileToMissingKeysMap)
          .sort()
          .map((localeSlashFile) => (
            <tr key={localeSlashFile}>
              <th
                className={`border-1 p-2 w-[200px] ${
                  bgByLocale[localeSlashFile.replace(/\/.*/, '')]
                }`}
              >
                <Copyable text={localeSlashFile} />
              </th>
              <td className="border-1 p-2">
                <details>
                  <summary>
                    <strong>{localeSlashFileToMissingKeysMap[localeSlashFile].size}</strong> missing
                    translations.
                  </summary>
                  <pre className="bg-inherit my-4 whitespace-pre-wrap">
                    <Copyable
                      fullButton={true}
                      text={localeSlashFileToMissingKeysMap[localeSlashFile].reduce(
                        (str, key) => str + `  ${JSON.stringify(key)}: "",\n`,
                        ''
                      )}
                    />
                  </pre>
                </details>
              </td>
            </tr>
          ))}
      </table>
      <h2 className="mt-8">Missing Translations By Key</h2>
      {keysWithMissingTranslations.map((key) => (
        <table key={key} className="my-8 w-full">
          <tr className="bg-gray-100">
            <th className="p-2 border-1 w-[200px]">Key</th>
            <td className="p-2 border-1">
              <pre className="bg-inherit whitespace-pre-wrap">
                <Copyable text={JSON.stringify(key, null, 2)} />
              </pre>
            </td>
          </tr>
          {allLocales
            .filter((locale) => klft[key][locale] || locale != 'en')
            .map((locale) =>
              keyFilesMap[key].map((file) => (
                <tr key={locale}>
                  <th className={`p-2 border-1  w-[200px] ${bgByLocale[locale]}`}>
                    <Copyable text={`${locale}/${file}`} />
                  </th>
                  {klft[key][locale] && klft[key][locale][file] ? (
                    <td className="p-2 border-1">
                      <pre className="bg-inherit whitespace-pre-wrap">
                        {JSON.stringify(klft[key][locale][file], null, 2)}
                      </pre>
                    </td>
                  ) : (
                    <td className="border-1">
                      <div className={`p-2 border-x-4 border-x-red-500 ${bgByLocale[locale]}`}>
                        Not Defined
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
        </table>
      ))}
    </div>
  );
}

const Copyable = ({ text, fullButton }) => {
  const addToast = useToastContext();

  return (
    <button
      className="text-left"
      onClick={() => {
        navigator.clipboard.writeText(text).then(
          () => {
            addToast({ message: `Copied: ${text}`, severity: SEVERITY.success });
          },
          (error) => {
            addToast({ message: `Could not copy text`, severity: SEVERITY.danger, error });
          }
        );
      }}
    >
      {text}

      {fullButton ? (
        <span className="tw-btn tw-btn-primary mt-4">
          Copy <FontAwesomeIcon icon={faCopy} className="ml-1" />
        </span>
      ) : (
        <FontAwesomeIcon icon={faCopy} className="ml-1 opacity-20" title="Copy" />
      )}
    </button>
  );
};

/*
 * Takes a flat list of objects with properties and converts them into a nested hierarchy.
 *
 * Example Input:
 *   recursiveMap(
 *     [  {key: 'Hello', locale: 'fr', translation: 'Bonjour', file: 'translation.json'},
 *   		  {key: 'Hi',    locale: 'fr', translation: 'Salut',   file: 'greetings.json'},
 *   		  {key: 'Hello', locale: 'es', translation: 'Hola',    file: 'greetings.json'},
 *     ],
 *     ['key', 'locale', 'file', 'translation']
 *   )
 *
 * Example Output:
 *   {
 *     "Hello": {
 *       "fr": { "translation.json": ["Bonjour"] },
 *       "es": { "greetings.json": ["Hola"] }
 *     },
 *     "Hi": {
 *       "fr": { "greetings.json": ["Salut"] }
 *     }
 *   }
 */
const recursiveMap = (objects, objectKeys, finalSingle) => {
  if (objectKeys.length == 1) {
    const objectKey = objectKeys[0];

    const terminalSet = objects.map((o) => o[objectKey]);

    if (finalSingle) {
      for (const e of terminalSet) return e;
    } else {
      return new FunctionalSet(terminalSet);
    }
  } else {
    const objectKey = objectKeys[0];

    const map = {};

    const valuesForObjectKey = objects.map((o) => o[objectKey]);

    for (const value of valuesForObjectKey) {
      const objectsWithValue = objects.filter((o) => o[objectKey] == value);

      map[value] = recursiveMap(objectsWithValue, objectKeys.slice(1), finalSingle);
    }
    return map;
  }
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

const getKeys = (object) => new FunctionalSet(Object.keys(object));

class FunctionalSet extends Set {
  static allEqual(array) {
    if (array.length == 0) return true;
    let firstSet = null;

    for (const set of array) {
      if (firstSet === null) {
        firstSet = set;
      } else if (!firstSet.equals(set)) {
        return false;
      }
    }
    return true;
  }

  filter(callback) {
    const result = new FunctionalSet();

    for (const item of this) {
      if (callback(item)) {
        result.add(item);
      }
    }
    return result;
  }

  map(callback) {
    const result = new FunctionalSet();

    for (const item of this) {
      result.add(callback(item));
    }
    return result;
  }

  reduce(callback, accumulator) {
    for (const item of this) {
      accumulator = callback(accumulator, item);
    }
    return accumulator;
  }

  some(callback) {
    for (const item of this) {
      if (callback(item)) {
        return true;
      }
    }
    return false;
  }

  intersection(otherSet) {
    const result = new FunctionalSet();

    for (const item of otherSet) {
      if (this.has(item)) {
        result.add(item);
      }
    }
    return result;
  }

  union(otherSet) {
    const result = new FunctionalSet();

    for (const item of this) result.add(item);
    for (const item of otherSet) result.add(item);
    return result;
  }

  itemsNotIn(otherSet) {
    const result = new FunctionalSet();

    for (const item of this) {
      if (!otherSet.has(item)) {
        result.add(item);
      }
    }
    return result;
  }

  isSubsetOf(otherSet) {
    for (const item of this) {
      if (!otherSet.has(item)) {
        return false;
      }
    }
    return true;
  }

  equals(otherSet) {
    return this.isSubsetOf(otherSet) && otherSet.isSubsetOf(this);
  }
}
