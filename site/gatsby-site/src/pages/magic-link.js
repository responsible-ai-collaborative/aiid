import React, { useCallback, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import HeadContent from 'components/HeadContent';

const MagicLink = ({ location }) => {
  const params = new URLSearchParams(location.search);

  const link = params.get('link');

  const handleClick = useCallback(() => {
    if (link) {
      window.location.href = decodeURIComponent(link);
    }
  }, [link]);

  useEffect(() => {
    if (link) {
      const timer = setTimeout(() => {
        window.location.href = decodeURIComponent(link);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [link]);

  if (!link) {
    return (
      <div>
        <Trans>Invalid link</Trans>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <p>
        <Trans>Click the button below to continue.</Trans>
      </p>
      <p>
        <Trans>You will be redirected in 5 seconds.</Trans>
      </p>
      <Button onClick={handleClick} data-cy="magic-link-btn">
        <Trans>Continue</Trans>
      </Button>
    </div>
  );
};

export const Head = (props) => {
  const { t } = useTranslation();

  return (
    <HeadContent
      metaTitle={t('AIID - Continue')}
      path={props.location.pathname}
      metaDescription={t('Continue to your destination')}
    />
  );
};

export default MagicLink;
