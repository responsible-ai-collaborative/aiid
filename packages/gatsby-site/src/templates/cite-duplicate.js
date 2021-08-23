import React from 'react';
import Helmet from 'react-helmet';

import Container from 'react-bootstrap/Container';

import Layout from 'components/Layout';
import Link from 'components/Link';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';

import { getCanonicalUrl } from 'utils/getCanonicalUrl';

const IncidentCite = ({ pageContext, ...props }) => {
  const { true_incident_number, duplicate_incident_number } = pageContext;

  // meta tags

  const metaTitle = 'Incident ' + true_incident_number;

  const metaDescription = 'Citation record for Incident ' + duplicate_incident_number;

  const canonicalUrl = getCanonicalUrl(true_incident_number);

  return (
    <Layout {...props}>
      <Helmet>
        {metaTitle ? <title>{metaTitle}</title> : null}
        {metaTitle ? <meta name="title" content={metaTitle} /> : null}
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="twitter:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="twitter:description" content={metaDescription} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading>{metaDescription}</StyledHeading>
      </div>
      <StyledMainWrapper>
        <Container>
          This incident is a duplicate of Incident{' '}
          <Link to={`/cite/${true_incident_number}`}>{true_incident_number}</Link>. All new reports
          and citations should be directed to incident {true_incident_number}. The reports
          previously found on this page have been migrated to the previously existing incident.
        </Container>
      </StyledMainWrapper>
    </Layout>
  );
};

export default IncidentCite;
