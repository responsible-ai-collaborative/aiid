import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import HeadContent from 'components/HeadContent';

const MagicLink = ({ location }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [link, setLink] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const linkParam = params.get('link');

    setLink(linkParam);
    setIsLoading(false);

    if (linkParam) {
      window.location.href = decodeURIComponent(linkParam);
    }
  }, [location.search]);

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
        <Trans>Redirecting...</Trans>
      </p>
    </div>
  );
};

export const Head = (props) => {
  return <HeadContent path={props.location.pathname} />;
};

export default MagicLink;
