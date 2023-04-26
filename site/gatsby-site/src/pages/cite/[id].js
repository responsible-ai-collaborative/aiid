import React, { useEffect, useState } from 'react';
import { Spinner } from 'flowbite-react';
import { CloudinaryImage } from '@cloudinary/base';
import { Trans } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { graphql } from 'gatsby';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { sortIncidentsByDatePublished } from 'utils/cite';
import config from '../../../config';
import { isCompleteReport } from 'utils/variants';
import { FIND_FULL_INCIDENT } from '../../graphql/incidents';
import CiteDynamicTemplate from 'templates/citeDynamicTemplate';

function CiteDynamicPage(props) {
  const {
    data: { allMongodbAiidprodTaxa, entities: entitiesData, responses },
    params: { id: incident_id },
  } = props;

  const nlp_similar_incidents = [];

  const editor_similar_incidents = [];

  const editor_dissimilar_incidents = [];

  const [incident, setIncident] = useState(null);

  // meta tags

  const [metaTitle, setMetaTitle] = useState(null);

  const [metaDescription, setMetaDescription] = useState(null);

  const [metaImage, setMetaImage] = useState(null);

  const { data: incidentData, loading } = useQuery(FIND_FULL_INCIDENT, {
    variables: { query: { incident_id } },
  });

  useEffect(() => {
    if (incidentData?.incident) {
      const incidentTemp = { ...incidentData.incident };

      const sortedIncidentReports = sortIncidentsByDatePublished(incidentTemp.reports);

      const sortedReports = sortedIncidentReports.filter((report) => isCompleteReport(report));

      const publicID = sortedReports.find((report) => report.cloudinary_id)?.cloudinary_id;

      const image = new CloudinaryImage(publicID, {
        cloudName: config.cloudinary.cloudName,
      });

      setMetaTitle(`Incident ${incidentTemp.incident_id}: ${incidentTemp.title}`);
      setMetaDescription(incidentTemp.description);
      setMetaImage(image.createCloudinaryURL());
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
