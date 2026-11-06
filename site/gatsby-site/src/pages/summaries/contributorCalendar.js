import React from 'react';
import { graphql } from 'gatsby';
import HeadContent from 'components/HeadContent';
import ContributorCalendar from 'components/visualizations/ContributorCalendar';
import { Trans } from 'react-i18next';

const metaTitle = 'Contributor Calendar';

const metaDescription =
  'When reports are submitted to the AI Incident Database: a day-by-day calendar of submissions, by year and by submitter.';

export default function ContributorCalendarPage({ data }) {
  return (
    <>
      <div className="titleWrapper">
        <h1 className="tw-styled-heading">
          <Trans>{metaTitle}</Trans>
        </h1>
      </div>
      <p className="mb-4">
        <Trans>
          Every report carries the date it was submitted. This calendar shades each day by the
          number of reports submitted, one row per year, and can be narrowed to a single submitter.
        </Trans>
      </p>
      <ContributorCalendar incidents={data.incidents.nodes} />
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
  query ContributorCalendar {
    incidents: allMongodbAiidprodIncidents {
      nodes {
        incident_id
        reports {
          report_number
          title
          date_submitted
          submitters
        }
      }
    }
  }
`;
