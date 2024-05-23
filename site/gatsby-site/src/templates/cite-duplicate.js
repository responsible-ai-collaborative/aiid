import React from 'react';
import HeadContent from 'components/HeadContent';

import Link from 'components/ui/Link';

import { getCanonicalUrl } from 'utils/getCanonicalUrl';
import Container from 'elements/Container';
import { Button } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from 'react-i18next';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { graphql } from 'gatsby';

const IncidentCite = ({ pageContext, data }) => {
  const { true_incident_number, duplicate_incident_number } = pageContext;

  const metaDescription = 'Citation record for Incident ' + duplicate_incident_number;

  const localizePath = useLocalizePath();

  const prevIncident = data.previousIncident.nodes[0]?.incident_id;

  const nextIncident = data.nextIncident.nodes[0]?.incident_id;

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
      <div className="flex justify-between mt-4">
        <Button
          color={'gray'}
          href={localizePath({ path: `/cite/${prevIncident}` })}
          disabled={!prevIncident}
          className="hover:no-underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <Trans>Previous Incident</Trans>
        </Button>
        <Button
          color={'gray'}
          href={localizePath({ path: `/cite/${nextIncident}` })}
          disabled={!nextIncident}
          className="hover:no-underline"
        >
          <Trans>Next Incident</Trans>
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </Button>
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

export const query = graphql`
  query DuplicateCitationPageQuery($duplicate_incident_number: Int) {
    previousIncident: allMongodbAiidprodIncidents(
      filter: { incident_id: { lt: $duplicate_incident_number } }
      limit: 1
      sort: { incident_id: DESC }
    ) {
      nodes {
        incident_id
      }
    }
    nextIncident: allMongodbAiidprodIncidents(
      filter: { incident_id: { gt: $duplicate_incident_number } }
      limit: 1
      sort: { incident_id: ASC }
    ) {
      nodes {
        incident_id
      }
    }
  }
`;

export default IncidentCite;
