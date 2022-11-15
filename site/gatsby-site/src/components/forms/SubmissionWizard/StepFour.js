import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalization } from 'gatsby-theme-i18n';
import Link from 'components/ui/Link';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { Alert } from 'flowbite-react';

const StepFour = () => {
  const { i18n } = useTranslation(['submit']);

  const { locale } = useLocalization();

  const localizedPath = useLocalizePath();

  return (
    <span data-cy="submission-success">
      <Alert
        color="success"
        additionalContent={
          <>
            <Trans i18n={i18n} ns="submit">
              You can see your submission{' '}
              <Link to={localizedPath({ path: '/apps/submitted', language: locale })}>here</Link>.
            </Trans>
            <div className="flex mt-4">
              <Link to={localizedPath({ path: '/apps/submitted', language: locale })}>
                <button
                  type="button"
                  className="mr-2 inline-flex items-center rounded-lg bg-green-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-800 dark:hover:bg-green-900 h-full"
                >
                  <Trans i18n={i18n} ns="submit">
                    Review queue
                  </Trans>
                </button>
              </Link>
              <Link to={localizedPath({ path: '/', language: locale })}>
                <button
                  type="button"
                  className="rounded-lg border border-green-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 dark:border-green-800 dark:text-green-800 dark:hover:text-white"
                >
                  <Trans>Home</Trans>
                </button>
              </Link>
            </div>
          </>
        }
      >
        <h3 className="text-lg font-medium text-green-700 dark:text-green-800">
          <Trans i18n={i18n} ns="submit">
            Report successfully added to review queue
          </Trans>
        </h3>
      </Alert>
    </span>
  );
};

export default StepFour;
