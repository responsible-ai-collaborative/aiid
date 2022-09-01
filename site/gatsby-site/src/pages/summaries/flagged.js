import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql } from 'gatsby';

import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';

const ReportList = ({ report }) => {
  const uid = '#' + report['report_number'];

  const tabbedRender = ['description', 'text'];

  let untabbedRender = Object.keys(report);

  tabbedRender.forEach((element) => untabbedRender.splice(untabbedRender.indexOf(element), 1));
  return (
    <>
      <ListGroup data-cy="report">
        {untabbedRender.map((key) => (
          <ListGroup.Item key={uid + key}>
            {key}: {report[key]}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Tab.Container defaultActiveKey={uid + 'url'}>
        <Row>
          <Col xs={12} sm={6} lg={3}>
            <ListGroup>
              {tabbedRender.map((key) => (
                <ListGroup.Item action eventKey={uid + key} key={uid + key}>
                  {key}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col xs={12} sm={6} lg={9}>
            <Tab.Content>
              {tabbedRender.map((key) => (
                <Tab.Pane eventKey={uid + key} key={uid + key}>
                  {report[key]}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};

const IncidentList = ({ incidents }) => {
  return (
    <div className="bootstrap">
      {incidents.map((incident) => (
        <div key={incident.incident_id}>
          <h2>Incident {incident.incident_id}</h2>
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
