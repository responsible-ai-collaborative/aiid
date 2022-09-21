import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import StepContainer from './StepContainer';
import { useLocalization } from 'gatsby-theme-i18n';
import Link from 'components/ui/Link';
import useLocalizePath from 'components/i18n/useLocalizePath';

const StepFour = () => {
  const { i18n } = useTranslation(['submit']);

  const { locale } = useLocalization();

  const localizedPath = useLocalizePath();

  return (
    <StepContainer>
      <Trans i18n={i18n} ns="submit">
        Report successfully added to review queue. It will appear on the{' '}
        <Link to={localizedPath({ path: '/apps/submitted', language: locale })}>
          review queue page
        </Link>{' '}
        within an hour.
      </Trans>
    </StepContainer>
  );
};

export default StepFour;
