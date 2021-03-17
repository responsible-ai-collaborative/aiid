import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import ListGroup from 'react-bootstrap/ListGroup';
import Layout from 'components/Layout';
import Link from 'components/Link';
import ReportedIncident from 'components/ReportedIncident';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';

const SubmittedIncidentsPage = ({ data, ...props }) => {
  if (!data) {
    return null;
  }
  const { allMongodbAiidprodSubmissions, allMongodbAiidprodQuickadd } = data;

  const fullSubmissions = allMongodbAiidprodSubmissions['edges'];

  const quickSubmissions = allMongodbAiidprodQuickadd['edges'];

  // sort by value
  fullSubmissions.sort(function (a, b) {
    return a['node']['incident_date'] - b['node']['incident_date'];
  });
  quickSubmissions.sort(function (a, b) {
    return a['node']['date_submitted'] - b['node']['date_submitted'];
  });

  return (
    <Layout {...props}>
      <Helmet>
        <title>Submitted Incident Report List</title>
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading>Submitted Incident Report List</StyledHeading>
      </div>
      <StyledMainWrapper>
        <p className="paragraph">
          The following incident reports have been <Link to="/about_apps/2-submit">submitted </Link>{' '}
          by users and are pending review by editors. Only editors may promote these records to
          incident reports in the database.
        </p>
        <p>Please note that this list updates hourly. New submissions are not immediately shown.</p>
        <ListGroup className="mb-5">
          {fullSubmissions.map(({ node }) => (
            <ListGroup.Item key={node.id} className="m-0 p-0">
              <ReportedIncident incident={node} />
            </ListGroup.Item>
          ))}
        </ListGroup>
        <h1>Quick Add URLs</h1>
        <p>
          These reports were added anonymously by users in the{' '}
          <Link to="/apps/quickadd"> Quick Add </Link> form.
        </p>
        <ListGroup className="mb-5">
          {quickSubmissions.map(({ node }) => (
            <ListGroup.Item key={node.id}>
              <a href={node.url}>{node.url}</a>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </StyledMainWrapper>
    </Layout>
  );
};

export default SubmittedIncidentsPage;

export const pageQuery = graphql`
  query AllSubmittedReports {
    allMongodbAiidprodSubmissions {
      edges {
        node {
          title
          source_domain
          authors
          submitters
          incident_date
          incident_id
          url
          image_url
          date_downloaded
          date_published
          date_submitted
          date_modified
          text
          description
          language
          id
          mongodb_id
        }
      }
    }
    allMongodbAiidprodQuickadd {
      edges {
        node {
          id
          date_submitted
          url
          source_domain
        }
      }
    }
  }
`;
