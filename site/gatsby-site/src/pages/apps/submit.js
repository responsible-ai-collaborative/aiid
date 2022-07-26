import React from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { StyledHeading } from 'components/styles/Docs';
import SubmitForm from 'components/forms/SubmitForm';

const SubmitPage = (props) => (
  <Layout {...props}>
    <Helmet>
      <title>New Incident Report</title>
    </Helmet>
    <div className={'titleWrapper'}>
      <StyledHeading>New Incident Report</StyledHeading>
    </div>
    <p>
      The following form will create a new incident report for{' '}
      <Link to="/apps/submitted">review </Link> and inclusion into the AI Incident Database. Please
      carefully check your entries for content issues (e.g., accidental copy and paste of
      advertisements). For details on the database ingestion process, please check the{' '}
      <Link to="/research/1-criteria/">research pages</Link> or{' '}
      <Link to="/contact">contact us with questions.</Link>{' '}
    </p>
    <SubmitForm />
  </Layout>
);

export default SubmitPage;
