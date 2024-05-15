import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import { Trans } from 'react-i18next';
import useLocalizePath from 'components/i18n/useLocalizePath';

import { navigate } from 'gatsby';

export default function Random({ data }) {
  const localizePath = useLocalizePath();

  const incidents = data.allMongodbAiidprodIncidents.nodes;

  const randomIncidentId = incidents[Math.floor(Math.random() * incidents.length)].incident_id;

  useEffect(() => {
    if (window) {
      navigate(localizePath({ path: '/cite/' + randomIncidentId }), { replace: true });
    }
  }, []);

  return (
    <p>
      <Trans>Redirecting...</Trans>
    </p>
  );
}

export const pageQuery = graphql`
  query IncidentIds {
    allMongodbAiidprodIncidents {
      nodes {
        incident_id
      }
    }
  }
`;
