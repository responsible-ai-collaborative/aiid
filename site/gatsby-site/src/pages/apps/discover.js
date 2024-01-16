import React from 'react';
import AiidHead from 'components/AiidHead';
import Discover from 'components/discover/Discover';
import { useTranslation } from 'react-i18next';

function DiscoverApp() {
  return (
    <div className="w-full">
      <Discover />
    </div>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation();

  const metaTitle = t('Artificial Intelligence Incident Database - Discover');

  return (
    <AiidHead
      path={pathname}
      metaTitle={metaTitle}
      metaDescription={t('Find AI related incidents and reports')}
    >
      <title>{metaTitle}</title>
    </AiidHead>
  );
};

export default DiscoverApp;
