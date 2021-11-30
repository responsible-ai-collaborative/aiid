import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import ListGroup from 'react-bootstrap/ListGroup';
import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import { SubmissionsContextProvider } from 'contexts/submissionsContext';
import SubmissionList from 'components/SubmissionList';

const SubmittedIncidentsPage = ({ data, ...props }) => {
  if (!data) {
    return null;
  }

  const { allMongodbAiidprodQuickadd } = data;

  const quickSubmissions = allMongodbAiidprodQuickadd['edges'];

  // sort by value
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
      <SubmissionsContextProvider>
        <SubmissionList />
      </SubmissionsContextProvider>
      <StyledMainWrapper>
        <h1>Quick Add URLs</h1>
        <p>
          These reports were added anonymously by users in the Quick Add form on the landing page
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
