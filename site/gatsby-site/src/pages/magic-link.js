import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import HeadContent from 'components/HeadContent';

const MagicLink = ({ location }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [link, setLink] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const linkParam = params.get('link');

    setLink(linkParam);
    setIsLoading(false);
  }, [location.search]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <p>
          <Trans>Loading...</Trans>
        </p>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <p>
          <Trans>Invalid link</Trans>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <p>
        <Trans>
          You will be redirected automatically in 5 seconds, or click the button below to continue
          now.
        </Trans>
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
