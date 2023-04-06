import React, { useEffect, useState } from 'react';
import { Spinner } from 'flowbite-react';
import { CloudinaryImage } from '@cloudinary/base';
import { Trans } from 'react-i18next';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { useQuery } from '@apollo/client';
import { graphql } from 'gatsby';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { getTranslatedReports, sortIncidentsByDatePublished } from 'utils/cite';
import { computeEntities, RESPONSE_TAG } from 'utils/entities';
import config from '../../../config';
import { isCompleteReport } from 'utils/variants';
import { FIND_FULL_INCIDENT, FIND_INCIDENT } from '../../graphql/incidents';
import CiteTemplate from 'templates/citeTemplate';
import { FIND_CLASSIFICATION } from '../../graphql/classifications';

function CiteDynamicPage(props) {
  const {
    data: { allMongodbAiidprodTaxa, entities: entitiesData, responses },
    params: { id: incident_id },
  } = props;

  const nlp_similar_incidents = [];

  const editor_similar_incidents = [];

  const editor_dissimilar_incidents = [];

  const { locale } = useLocalization();

  const [incident, setIncident] = useState(null);

  const [entities, setEntities] = useState(null);

  const [sortedReports, setSortedReports] = useState([]);

  const [timeline, setTimeline] = useState(null);

  const [variants, setVariants] = useState([]);

  const [classifications, setClassifications] = useState(null);

  // meta tags

  const [metaTitle, setMetaTitle] = useState(null);

  const [metaDescription, setMetaDescription] = useState(null);

  const [metaImage, setMetaImage] = useState(null);

  const { data: incidentData, loading } = useQuery(FIND_FULL_INCIDENT, {
    variables: { query: { incident_id } },
  });

  const { data: prevIncident } = useQuery(FIND_INCIDENT, {
    variables: { query: { incident_id: parseInt(incident_id) - 1 } },
  });

  const { data: nextIncident } = useQuery(FIND_INCIDENT, {
    variables: { query: { incident_id: parseInt(incident_id) + 1 } },
  });

  const { data: classificationsData } = useQuery(FIND_CLASSIFICATION, {
    variables: { query: { incident_id, publish: true } },
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
        locale,
      });

      const sortedIncidentReports = sortIncidentsByDatePublished(incidentReports);

      const sortedReports = sortedIncidentReports.filter((report) => isCompleteReport(report));

      const publicID = sortedReports.find((report) => report.cloudinary_id)?.cloudinary_id;

      const image = new CloudinaryImage(publicID, {
        cloudName: config.cloudinary.cloudName,
      });

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
      setMetaDescription(incidentTemp.description);
      setMetaImage(image.createCloudinaryURL());
      setTimeline(timelineTemp);
      setSortedReports(sortedReports);
      setVariants(variantsTemp);
      setIncident(incidentTemp);
    }
  }, [incidentData]);

  return (
    <Layout {...{ props }} location={props.location}>
      <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname, metaImage }}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      {loading ? (
        <Spinner />
      ) : !loading && incident ? (
        <CiteTemplate
          incident={incident}
          sortedReports={sortedReports}
          variants={variants}
          metaTitle={metaTitle}
          entities={entities}
          timeline={timeline}
          locationPathName={props.location.pathname}
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
        />
      ) : (
        <Trans>Incident {{ incident_id }} not found</Trans>
      )}
    </Layout>
  );
}

export const query = graphql`
  query CitationPageQuery {
    allMongodbAiidprodTaxa {
      nodes {
        id
        namespace
        weight
        description
        complete_entities
        dummy_fields {
          field_number
          short_name
        }
        field_list {
          field_number
          short_name
          long_name
          short_description
          long_description
          display_type
          mongo_type
          default
          placeholder
          permitted_values
          weight
          instant_facet
          required
          public
          complete_from {
            all
            current
            entities
          }
          subfields {
            field_number
            short_name
            long_name
            short_description
            long_description
            display_type
            mongo_type
            default
            placeholder
            permitted_values
            weight
            instant_facet
            required
            public
            complete_from {
              all
              current
              entities
            }
          }
        }
      }
    }

    entities: allMongodbAiidprodEntities {
      nodes {
        entity_id
        name
      }
    }

    responses: allMongodbAiidprodReports(filter: { tags: { in: ["response"] } }) {
      nodes {
        report_number
      }
    }
  }
`;

export default CiteDynamicPage;
