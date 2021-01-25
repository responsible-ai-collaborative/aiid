import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { Layout, Link } from 'components';
import { StyledHeading } from 'components/styles/Docs';
import IncidentForm from 'components/forms/IncidentForm';

export default class SubmitPage extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>New Incident from Report</title>
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>New Incident from Report</StyledHeading>
        </div>
        <p>
          The following form will create a new incident report for{' '}
          <Link to="/apps/submitted">review </Link> and inclusion into the AI Incident Database.
          Please be careful in your entries{' '}
        </p>
        <IncidentForm />
      </Layout>
    );
  }
}
