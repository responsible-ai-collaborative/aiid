import React from 'react';
import HeadContent from 'components/HeadContent';
import Discover from 'components/discover/Discover';
import { useTranslation } from 'react-i18next';
import { graphql } from 'gatsby';

function DiscoverApp(props) {
  const { data } = props;

  const reports = data.reports?.nodes;

  const numBins = 16;

  const histogramBins = new Array(numBins).fill().map(() => 0);

  const publishDates = reports.map((report) => new Date(report.date_published));

  const latestPublishDate = Math.max(...publishDates);

  const earliestPublishDate = Math.min(...publishDates);

  for (const publishDate of publishDates) {
    const position =
      (publishDate - earliestPublishDate) / (latestPublishDate - earliestPublishDate);

    const index = Math.round(position * (histogramBins.length - 1));

    histogramBins[index] += 1;
  }

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

export const query = graphql`
  query DiscoverPageQuery {
    reports: allMongodbAiidprodReports {
      nodes {
        report_number
        date_published
      }
    }
  }
`;

export default DiscoverApp;
