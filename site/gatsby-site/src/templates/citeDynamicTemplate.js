import React, { useEffect, useState } from 'react';
import { Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { useQuery } from '@apollo/client';
import { getTranslatedReports, sortIncidentsByDatePublished } from 'utils/cite';
import { computeEntities, RESPONSE_TAG } from 'utils/entities';
import { isCompleteReport } from 'utils/variants';
import { FIND_FULL_INCIDENT, FIND_INCIDENT } from '../graphql/incidents';
import CiteTemplate from 'templates/citeTemplate';
import { FIND_CLASSIFICATION } from '../graphql/classifications';

function CiteDynamicTemplate({
  allMongodbAiidprodTaxa,
  entitiesData,
  responses,
  incident_id,
  nlp_similar_incidents,
  editor_similar_incidents,
  editor_dissimilar_incidents,
  locationPathName,
  setIsLiveData,
}) {
  const { locale: language } = useLocalization();

  const [loadingIncident, setLoadingIncident] = useState(true);

  const [incident, setIncident] = useState(null);

  const [entities, setEntities] = useState(null);

  const [sortedReports, setSortedReports] = useState([]);

  const [timeline, setTimeline] = useState(null);

  const [variants, setVariants] = useState([]);

  const [classifications, setClassifications] = useState(null);

  // meta tags

  const [metaTitle, setMetaTitle] = useState(null);

  const { data: incidentData, loading } = useQuery(FIND_FULL_INCIDENT, {
    variables: { filter: { incident_id: { EQ: parseInt(incident_id) } } },
  });

  const { data: prevIncident } = useQuery(FIND_INCIDENT, {
    variables: { filter: { incident_id: { EQ: parseInt(incident_id) - 1 } } },
  });

  const { data: nextIncident } = useQuery(FIND_INCIDENT, {
    variables: { filter: { incident_id: { EQ: parseInt(incident_id) + 1 } } },
  });

  const { data: classificationsData } = useQuery(FIND_CLASSIFICATION, {
    variables: { filter: { incidents: { EQ: incident_id }, publish: { EQ: true } } },
  });

  useEffect(() => {
    if (incidentData?.incident && classificationsData?.classifications) {
      const incidentTemp = { ...incidentData.incident };

      setClassifications({ nodes: classificationsData?.classifications });

      //set Entities incident fields
      incidentTemp.Alleged_deployer_of_AI_system = incidentTemp.AllegedDeployerOfAISystem.map(
        (e) => e.entity_id
      );
      incidentTemp.Alleged_developer_of_AI_system = incidentTemp.AllegedDeveloperOfAISystem.map(
        (e) => e.entity_id
      );
      incidentTemp.Alleged_harmed_or_nearly_harmed_parties =
        incidentTemp.AllegedHarmedOrNearlyHarmedParties.map((e) => e.entity_id);
      incidentTemp.implicated_systems = incidentTemp.implicated_systems.map((e) => e.entity_id);

      const entities = computeEntities({
        incidents: [incidentTemp],
        entities: entitiesData.nodes,
        responses: responses.nodes,
      });

      const incidentReports = getTranslatedReports({
        allMongodbAiidprodReports: { nodes: incidentTemp.reports },
        translations: {
          en: { nodes: incidentTemp.reports },
          es: { nodes: incidentTemp.reports },
          fr: { nodes: incidentTemp.reports },
        },
        language,
      });

      const sortedIncidentReports = sortIncidentsByDatePublished(incidentReports);

      const sortedReports = sortedIncidentReports.filter((report) => isCompleteReport(report));

      const timelineTemp = sortedReports.map(
        ({ date_published, title, mongodb_id, report_number, tags }) => ({
          date_published,
          title,
          mongodb_id,
          report_number,
          isResponse: tags && tags.includes(RESPONSE_TAG),
        })
      );

      timelineTemp.push({
        date_published: incidentTemp.date,
        title: 'Incident Occurrence',
        mongodb_id: 0,
        isOccurrence: true,
      });

      const variantsTemp = sortedIncidentReports.filter((report) => !isCompleteReport(report));

      setEntities(entities);
      setMetaTitle(`Incident ${incidentTemp.incident_id}: ${incidentTemp.title}`);
      setTimeline(timelineTemp);
      setSortedReports(sortedReports);
      setVariants(variantsTemp);
      setIncident(incidentTemp);
      setLoadingIncident(false);
    }
  }, [incidentData, classificationsData]);

  return (
    <>
      {(loading || loadingIncident) && (
        <div className="mt-3">
          <Spinner />
        </div>
      )}
      {!loading && !loadingIncident && !incident ? (
        <Trans>Incident {{ incident_id }} not found</Trans>
      ) : (
        incident && (
          <CiteTemplate
            incident={incident}
            sortedReports={sortedReports}
            variants={variants}
            metaTitle={metaTitle}
            entities={entities}
            timeline={timeline}
            locationPathName={locationPathName}
            allMongodbAiidprodTaxa={allMongodbAiidprodTaxa}
            allMongodbAiidprodClassifications={classifications}
            nextIncident={
              nextIncident && nextIncident.incident ? nextIncident.incident.incident_id : null
            }
            prevIncident={
              prevIncident && prevIncident.incident ? prevIncident.incident.incident_id : null
            }
            nlp_similar_incidents={nlp_similar_incidents}
            editor_similar_incidents={editor_similar_incidents}
            editor_dissimilar_incidents={editor_dissimilar_incidents}
            liveVersion={true}
            setIsLiveData={setIsLiveData}
          />
        )
      )}
    </>
  );
}

export default CiteDynamicTemplate;
