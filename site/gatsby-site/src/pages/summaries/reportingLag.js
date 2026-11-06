import React from 'react';
import { graphql } from 'gatsby';
import HeadContent from 'components/HeadContent';
import ReportingLag from 'components/visualizations/ReportingLag';
import { Trans } from 'react-i18next';

const metaTitle = 'Reporting Lag';

const metaDescription =
  'How long it takes for an AI incident to be reported: the gap between each incident date and the publication of its first report.';

export default function ReportingLagPage({ data }) {
  return (
    <>
      <div className="titleWrapper">
        <h1 className="tw-styled-heading">
          <Trans>{metaTitle}</Trans>
        </h1>
      </div>
      <p className="mb-4">
        <Trans>
          For each incident, the lag is the number of days between the incident date and the
          publication date of the earliest report in the database. Some incidents are reported the
          same day; others surface years later through investigations, lawsuits or research.
        </Trans>
      </p>
      <ReportingLag incidents={data.incidents.nodes} />
    </>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  return (
    <HeadContent
      path={pathname}
      metaTitle={metaTitle}
      metaType="website"
      metaDescription={metaDescription}
    />
  );
};

export const pageQuery = graphql`
  query ReportingLag {
    incidents: allMongodbAiidprodIncidents {
      nodes {
        incident_id
        title
        date
        reports {
          report_number
          title
          date_published
          source_domain
        }
      }
    }
  }
`;
