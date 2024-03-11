import React, { Fragment } from 'react';
import HeadContent from 'components/HeadContent';
import { graphql } from 'gatsby';

const ReportList = ({ report }) => (
  <dl data-cy="report" className="my-4 grid grid-cols-1 md:grid-cols-2 border-2 rounded">
    {Object.keys(report).map((key, i) => (
      <Fragment key={key}>
        <dt className={'border-gray p-2' + (i % 2 == 0 ? ' bg-gray-100' : '')}>{key}</dt>
        <dd
          style={{ maxHeight: '400px' }}
          className={
            'mb-0 p-2 overflow-y-auto overflow-x-hidden' +
            (i % 2 == 0 ? ' bg-gray-100' : '') +
            (key.includes('url') ? ' break-words' : '')
          }
        >
          {key.includes('url') ? <a href={report[key]}>{report[key]}</a> : <>{report[key]}</>}
        </dd>
      </Fragment>
    ))}
  </dl>
);

const IncidentList = ({ incidents }) => {
  return (
    <>
      {incidents.map((incident) => (
        <div key={incident.incident_id}>
          <h2 className="mt-4">Incident {incident.incident_id}</h2>
          {incident.reports.map((report) => (
            <ReportList key={report.report_number} report={report} />
          ))}
        </div>
      ))}
    </>
  );
};

export default function FlaggedIncidents({ data }) {
  const incidents = data.allMongodbAiidprodIncidents.nodes;

  return (
    <>
      <div className={'titleWrapper'}>
        <h1>Flagged Incident List</h1>
      </div>
      <div className="styled-main-wrapper">
        <p className="paragraph">
          The following incident reports have been flagged by users and are pending review by
          editors.
        </p>
        <IncidentList incidents={incidents} />
      </div>
    </>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const metaTitle = 'Incident List';

  const metaDescription = 'Flagged Incident List';

  return <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaDescription} />;
};

export const pageQuery = graphql`
  query AllFlaggedIncidents {
    allMongodbAiidprodIncidents(
      filter: { reports: { elemMatch: { flag: { eq: true } } } }
      sort: { incident_id: ASC }
    ) {
      nodes {
        incident_id
        title
        date
        reports {
          report_number
          title
          url
          authors
          date_downloaded
          date_modified
          date_published
          date_submitted
          description
          flag
          image_url
          language
          source_domain
          submitters
        }
      }
    }
  }
`;
