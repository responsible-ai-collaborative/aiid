import React, { useEffect, useState } from 'react';
import { Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { graphql } from 'gatsby';
import { FIND_FULL_INCIDENT } from '../../graphql/incidents';
import CiteDynamicTemplate from 'templates/citeDynamicTemplate';
import { useLocalization } from 'plugins/gatsby-theme-i18n';

function CiteDynamicPage(props) {
  const {
    data: { allMongodbAiidprodTaxa, entities: entitiesData, responses },
    params: { id: incident_id },
  } = props;

  const { config: availableLanguages } = useLocalization();

  const nlp_similar_incidents = [];

  const editor_similar_incidents = [];

  const editor_dissimilar_incidents = [];

  const [incident, setIncident] = useState(null);

  const { data: incidentData, loading } = useQuery(FIND_FULL_INCIDENT, {
    variables: {
      filter: { incident_id: { EQ: parseInt(incident_id) } },
      translationLanguages: availableLanguages.filter((c) => c.code !== 'en').map((c) => c.code), // Exclude English since it's the default language
    },
  });

  useEffect(() => {
    if (incidentData?.incident) {
      const incidentTemp = { ...incidentData.incident };

      setIncident(incidentTemp);
    }
  }, [incidentData]);

  return (
    <div {...props}>
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
    </div>
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
