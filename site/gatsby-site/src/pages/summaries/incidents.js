import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql } from 'gatsby';
import Button from 'react-bootstrap/Button';
import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import { hasVariantData } from 'utils/variants';

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
            <Button variant="outline-primary" href={'/cite/' + incident.incident_id}>
              Citation
            </Button>
            <Button
              variant="outline-primary"
              href={'/apps/discover?incident_id=' + incident.incident_id}
            >
              Discover
            </Button>
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
        <StyledHeading>Incident List</StyledHeading>
      </div>
      <StyledMainWrapper>
        <p className="paragraph">
          This is a simple numeric listing of all incidents and their reports within the database.
          If you would like to explore the contents of the reports, you should work through the
          <Link to="/apps/discover"> Discover app</Link>.
        </p>
        <IncidentList incidents={incidents} />
      </StyledMainWrapper>
    </Layout>
  );
}

export const pageQuery = graphql`
  query AllIncidentsPart {
    allMongodbAiidprodIncidents(sort: { order: ASC, fields: incident_id }) {
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
