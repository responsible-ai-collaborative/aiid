import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql } from 'gatsby';
import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';

const ReportList = ({ report }) => (
  <dl data-cy="report" className="my-4 grid grid-cols-1 md:grid-cols-2 border-2 rounded">
    {Object.keys(report).map((key, i) => (
      <>
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
      </>
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

export default function FlaggedIncidents({ data, ...props }) {
  const incidents = data.allMongodbAiidprodIncidents.nodes
    .filter((incident) => {
      return incident.reports.some((report_number) =>
        data.allMongodbAiidprodReports.nodes.find((report) => report.report_number == report_number)
      );
    })
    .map((incident) => {
      const reports = incident.reports.reduce((filtered, report_number) => {
        const report = data.allMongodbAiidprodReports.nodes.find(
          (r) => r.report_number == report_number
        );

        if (report) {
          filtered.push(report);
        }

        return filtered;
      }, []);

      return { ...incident, reports };
    });

  return (
    <Layout {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>Incident List</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <StyledHeading>Flagged Incident List</StyledHeading>
      </div>
      <StyledMainWrapper>
        <p className="paragraph">
          The following incident reports have been flagged by users and are pending review by
          editors.
        </p>
        <IncidentList incidents={incidents} />
      </StyledMainWrapper>
    </Layout>
  );
}

export const pageQuery = graphql`
  query AllFlaggedIncidents {
    allMongodbAiidprodIncidents(sort: { order: ASC, fields: incident_id }) {
      nodes {
        incident_id
        title
        date
        reports
      }
    }

    allMongodbAiidprodReports(filter: { flag: { eq: true } }) {
      nodes {
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
`;
