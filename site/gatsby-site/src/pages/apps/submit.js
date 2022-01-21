import React from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Link from 'components/Link';
import { StyledHeading } from 'components/styles/Docs';
import SubmitForm from 'components/forms/SubmitForm';
import { graphql } from 'gatsby'

const SubmitPage = (props) => {
  const { data } = props

  const tags = data.allMongodbAiidprodIncidents.edges.reduce((acc, curr) => {
    curr.node.tags ? acc.push(...curr.node.tags) : acc; return acc;
  }, []);

  return <Layout {...props}>
    <Helmet>
      <title>New Incident from Report</title>
    </Helmet>
    <div className={'titleWrapper'}>
      <StyledHeading>New Incident from Report</StyledHeading>
    </div>
    <p>
      The following form will create a new incident report for{' '}
      <Link to="/apps/submitted">review </Link> and inclusion into the AI Incident Database. Please
      be careful in your entries. All incident reports are manually reviewed for content issues
      (e.g., accidental copy and paste of advertisements) and consistency with the{' '}
      <Link to="/research/1-criteria/">acceptance criteria</Link>. Please{' '}
      <Link to="/contact">contact us with questions.</Link>{' '}
    </p>
    <SubmitForm tags={tags} />
  </ Layout>
}

export const query = graphql`
  query SubmitIncidentQuery {
    allMongodbAiidprodIncidents {
      edges {
        node {
          tags
        }
      }
    }
  }
`

export default SubmitPage;

