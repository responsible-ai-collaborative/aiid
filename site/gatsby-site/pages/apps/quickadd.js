import React from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Link from 'components/Link';
import { StyledHeading } from 'components/styles/Docs';
import QuickAddForm from 'components/forms/QuickAddForm';

const QuickAddPage = (props) => {
  return (
    <Layout {...props}>
      <Helmet>
        <title>Quick Add New Report URL</title>
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading>Quick Add New Report URL</StyledHeading>
      </div>
      <p>
        The following form will add a report link to the{' '}
        <Link to="/apps/submitted">review queue</Link> for inclusion into the AI Incident Database.
      </p>
      <QuickAddForm />
    </Layout>
  );
};

export default QuickAddPage;
