import React from 'react';
import HeadContent from 'components/HeadContent';

import Link from 'components/ui/Link';

import { getCanonicalUrl } from 'utils/getCanonicalUrl';
import Container from 'elements/Container';

const IncidentCite = ({ pageContext }) => {
  const { true_incident_number, duplicate_incident_number } = pageContext;

  const metaDescription = 'Citation record for Incident ' + duplicate_incident_number;

  return (
    <>
      <div className={'titleWrapper'}>
        <h1>{metaDescription}</h1>
      </div>
      <div className="styled-main-wrapper">
        <Container>
          This incident is a duplicate of Incident{' '}
          <Link to={`/cite/${true_incident_number}`}>{true_incident_number}</Link>. All new reports
          and citations should be directed to incident {true_incident_number}. The reports
          previously found on this page have been migrated to the previously existing incident.
        </Container>
      </div>
    </>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { true_incident_number, duplicate_incident_number } = props.pageContext;

  const metaTitle = 'Incident ' + true_incident_number;

  const metaDescription = 'Citation record for Incident ' + duplicate_incident_number;

  const canonicalUrl = getCanonicalUrl(true_incident_number);

  return <HeadContent path={pathname} {...{ metaTitle, metaDescription, canonicalUrl }} />;
};

export default IncidentCite;
