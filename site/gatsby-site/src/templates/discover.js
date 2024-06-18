import React from 'react';
import HeadContent from 'components/HeadContent';
import Discover from 'components/discover/Discover';
import { useTranslation } from 'react-i18next';

function DiscoverApp({ pageContext }) {
  const { histogramBins } = pageContext;

  return (
    <div className="w-full">
      <Discover {...{ histogramBins }} />
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
    <HeadContent
      path={pathname}
      metaTitle={metaTitle}
      metaDescription={t('Find AI related incidents and reports')}
    />
  );
};

export default DiscoverApp;
