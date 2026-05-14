import React from 'react';
import HeadContent from 'components/HeadContent';
import Discover from 'components/discover/Discover';
import NewsletterSignup from 'components/landing/NewsletterSignup';
import { useTranslation } from 'react-i18next';

function DiscoverApp() {
  return (
    <div className="w-full">
      <Discover />
      <div className="mt-5 md:mt-10">
        <NewsletterSignup />
      </div>
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
