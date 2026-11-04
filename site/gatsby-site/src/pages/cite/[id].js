import React, { useEffect, useState } from 'react';
import { Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { FIND_FULL_INCIDENT } from '../../graphql/incidents';
import CiteDynamicTemplate from 'templates/citeDynamicTemplate';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import ApiLoginRequired from 'components/ui/ApiLoginRequired';
import useApiAccess from 'hooks/useApiAccess';
import useAllEntities from 'hooks/useAllEntities';
import useResponseReports from 'hooks/useResponseReports';
import useTaxa from 'hooks/useTaxa';

function CiteDynamicPage(props) {
  const {
    params: { id: incident_id },
  } = props;

  const allMongodbAiidprodTaxa = useTaxa();

  const entitiesData = useAllEntities();

  const responses = useResponseReports();

  const { config: availableLanguages } = useLocalization();

  const nlp_similar_incidents = [];

  const editor_similar_incidents = [];

  const editor_dissimilar_incidents = [];

  const [incident, setIncident] = useState(null);

  const { hasApiAccess, loading: apiAccessLoading } = useApiAccess();

  // This route is the client-rendered fallback for incidents that have no
  // statically built page yet, so it reads the incident from the API and needs a
  // login. SEE: server/apiAccess.ts
  const { data: incidentData, loading } = useQuery(FIND_FULL_INCIDENT, {
    variables: {
      filter: { incident_id: { EQ: parseInt(incident_id) } },
      translationLanguages: availableLanguages.filter((c) => c.code !== 'en').map((c) => c.code), // Exclude English since it's the default language
    },
    skip: !hasApiAccess,
  });

  useEffect(() => {
    if (incidentData?.incident) {
      const incidentTemp = { ...incidentData.incident };

      setIncident(incidentTemp);
    }
  }, [incidentData]);

  return (
    <div {...props}>
      {apiAccessLoading || loading ? (
        <Spinner />
      ) : !hasApiAccess ? (
        // Checked before the "not found" branch, which would otherwise report a
        // missing incident when the request was simply never made.
        <ApiLoginRequired />
      ) : incident ? (
        <CiteDynamicTemplate
          allMongodbAiidprodTaxa={allMongodbAiidprodTaxa}
          entitiesData={entitiesData}
          incident_id={incident.incident_id}
          responses={responses}
          nlp_similar_incidents={nlp_similar_incidents}
          editor_similar_incidents={editor_similar_incidents}
          editor_dissimilar_incidents={editor_dissimilar_incidents}
          locationPathName={props.location.pathname}
        />
      ) : (
        <Trans>Incident {{ incident_id }} not found</Trans>
      )}
    </div>
  );
}

export default CiteDynamicPage;
