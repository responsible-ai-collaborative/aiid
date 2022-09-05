import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql } from 'gatsby';
import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';

const ReportList = ({ report }) => (
  <dl
    data-cy="report"
    className="tw-my-4 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-border-2 tw-rounded"
  >
    {Object.keys(report).map((key, i) => (
      <>
        <dt className={'tw-border-gray tw-p-2' + (i % 2 == 0 ? ' tw-bg-gray-100' : '')}>{key}</dt>
        <dd
          style={{ maxHeight: '400px' }}
          className={
            'tw-mb-0 tw-p-2 tw-overflow-y-auto tw-overflow-x-hidden' +
            (i % 2 == 0 ? ' tw-bg-gray-100' : '') +
            (key.includes('url') ? ' tw-break-words' : '')
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
    <div className="bootstrap">
      {incidents.map((incident) => (
        <div key={incident.incident_id}>
          <h2 className="tw-mt-4">Incident {incident.incident_id}</h2>
          {incident.reports.map((report) => (
            <ReportList key={report.report_number} report={report} />
          ))}
        </div>
      ))}
    </div>
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
      <AiidHelmet>
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
        ref_number
        source_domain
        submitters
        text
      }
    }
  }
`;
