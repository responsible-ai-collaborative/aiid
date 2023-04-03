import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql } from 'gatsby';
import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { hasVariantData } from 'utils/variants';
import { Button } from 'flowbite-react';

const ReportList = ({ items }) => {
  return (
    <ul className="pl-8 leading-6 my-4 list-revert">
      {items
        .filter((report) => !hasVariantData(report))
        .map((report) => (
          <li key={report.report_number} data-cy={`report-${report.report_number}`}>
            <a href={report.url}>{report.title}</a>
          </li>
        ))}
    </ul>
  );
};

const IncidentList = ({ incidents }) => {
  return (
    <div data-cy="incident-list">
      {incidents.map((incident) => (
        <div key={incident.incident_id} data-cy={`incident-${incident.incident_id}`}>
          <h2>
            Incident {incident.incident_id}{' '}
            <Button href={'/cite/' + incident.incident_id}>Citation</Button>
            <Button href={'/apps/discover?incident_id=' + incident.incident_id}>Discover</Button>
          </h2>
          <div className="text-xl">“{incident.title}”</div>
          <ReportList items={incident.reports} />
        </div>
      ))}
    </div>
  );
};

export default function Incidents({ data, ...props }) {
  const incidents = data.allMongodbAiidprodIncidents.nodes.map((incident) => {
    const reports = incident.reports.map(
      (report_number) =>
        data.allMongodbAiidprodReports.nodes.find((r) => r.report_number == report_number) || {
          report_number,
          title: `Missing Report ${report_number}`,
        } // there are missing reports, remove once that's fixed
    );

    return { ...incident, reports };
  });

  return (
    <Layout {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>Incident List</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <h1 className="font-karla font-bold flex-1 pt-0">Incident List</h1>
      </div>
      <div className="styled-main-wrapper">
        <p className="paragraph">
          This is a simple numeric listing of all incidents and their reports within the database.
          If you would like to explore the contents of the reports, you should work through the
          <Link to="/apps/discover"> Discover app</Link>.
        </p>
        <IncidentList incidents={incidents} />
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query AllIncidentsPart {
    allMongodbAiidprodIncidents(sort: { incident_id: ASC }) {
      nodes {
        incident_id
        title
        date
        reports
      }
    }
    allMongodbAiidprodReports {
      nodes {
        id
        report_number
        title
        url
        text_inputs
        text_outputs
      }
    }
  }
`;
