import React, { useState } from 'react';
import { CloudinaryImage } from '@cloudinary/base';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { graphql } from 'gatsby';
import HeadContent from 'components/HeadContent';
import { getTranslatedReports, sortIncidentsByDatePublished } from 'utils/cite';
import { computeEntities, RESPONSE_TAG } from 'utils/entities';
import config from '../../config';
import { isCompleteReport } from 'utils/variants';
import CiteTemplate from './citeTemplate';
import CiteDynamicTemplate from './citeDynamicTemplate';

function CitePage(props) {
  const {
    pageContext: {
      nextIncident,
      prevIncident,
      nlp_similar_incidents,
      editor_similar_incidents,
      editor_dissimilar_incidents,
    },
    data: {
      allMongodbAiidprodTaxa,
      allMongodbAiidprodClassifications,
      allMongodbAiidprodReports,
      allMongodbTranslationsReportsEs,
      allMongodbTranslationsReportsEn,
      allMongodbTranslationsReportsFr,
      allMongodbTranslationsReportsJa,
      incident,
      entities: entitiesData,
      responses,
    },
  } = props;

  const [isLiveData, setIsLiveData] = useState(false);

  const { locale } = useLocalization();

  // meta tags

  const metaTitle = `Incident ${incident.incident_id}: ${incident.title}`;

  const incidentReports = getTranslatedReports({
    allMongodbAiidprodReports,
    translations: {
      en: allMongodbTranslationsReportsEn,
      es: allMongodbTranslationsReportsEs,
      fr: allMongodbTranslationsReportsFr,
      ja: allMongodbTranslationsReportsJa,
    },
    locale,
  });

  const sortedIncidentReports = sortIncidentsByDatePublished(incidentReports);

  const sortedReports = sortedIncidentReports.filter((report) => isCompleteReport(report));

  const timeline = sortedReports.map(
    ({ date_published, title, mongodb_id, report_number, tags }) => ({
      date_published,
      title,
      mongodb_id,
      report_number,
      isResponse: tags && tags.includes(RESPONSE_TAG),
    })
  );

  timeline.push({
    date_published: incident.date,
    title: 'Incident Occurrence',
    mongodb_id: 0,
    isOccurrence: true,
  });

  const variants = sortedIncidentReports.filter((report) => !isCompleteReport(report));

  const entities = computeEntities({
    incidents: [incident],
    entities: entitiesData.nodes,
    responses: responses.nodes,
  });

  return (
    <div {...props}>
      {isLiveData ? (
        <CiteDynamicTemplate
          allMongodbAiidprodTaxa={allMongodbAiidprodTaxa}
          entitiesData={entitiesData}
          incident_id={incident.incident_id}
          responses={responses}
          nlp_similar_incidents={nlp_similar_incidents}
          editor_similar_incidents={editor_similar_incidents}
          editor_dissimilar_incidents={editor_dissimilar_incidents}
          locationPathName={props.location.pathname}
          setIsLiveData={setIsLiveData}
        />
      ) : (
        <CiteTemplate
          incident={incident}
          sortedReports={sortedReports}
          variants={variants}
          metaTitle={metaTitle}
          entities={entities}
          timeline={timeline}
          locationPathName={props.location.pathname}
          allMongodbAiidprodTaxa={allMongodbAiidprodTaxa}
          allMongodbAiidprodClassifications={allMongodbAiidprodClassifications}
          nextIncident={nextIncident}
          prevIncident={prevIncident}
          nlp_similar_incidents={nlp_similar_incidents}
          editor_similar_incidents={editor_similar_incidents}
          editor_dissimilar_incidents={editor_dissimilar_incidents}
          setIsLiveData={setIsLiveData}
        />
      )}
    </div>
  );
}

export const Head = (props) => {
  const {
    location: { pathname: path },
    data: {
      allMongodbAiidprodReports,
      allMongodbTranslationsReportsEs,
      allMongodbTranslationsReportsEn,
      allMongodbTranslationsReportsFr,
      incident,
    },
  } = props;

  const { locale } = useLocalization();

  const metaTitle = `Incident ${incident.incident_id}: ${incident.title}`;

  const metaDescription = incident.description;

  const incidentReports = getTranslatedReports({
    allMongodbAiidprodReports,
    translations: {
      en: allMongodbTranslationsReportsEn,
      es: allMongodbTranslationsReportsEs,
      fr: allMongodbTranslationsReportsFr,
    },
    locale,
  });

  const sortedIncidentReports = sortIncidentsByDatePublished(incidentReports);

  const sortedReports = sortedIncidentReports.filter((report) => isCompleteReport(report));

  const publicID = sortedReports.find((report) => report.cloudinary_id)?.cloudinary_id;

  const image = new CloudinaryImage(publicID, {
    cloudName: config.cloudinary.cloudName,
  });

  const metaImage = image.createCloudinaryURL();

  return <HeadContent {...{ metaTitle, metaDescription, path, metaImage }} metaType="website" />;
};

export const query = graphql`
  query CitationPageQuery(
    $incident_id: Int
    $report_numbers: [Int]
    $translate_es: Boolean!
    $translate_fr: Boolean!
    $translate_ja: Boolean!
    $translate_en: Boolean!
  ) {
    allMongodbAiidprodClassifications(
      filter: { incidents: { elemMatch: { incident_id: { eq: $incident_id } } } }
    ) {
      nodes {
        incidents {
          incident_id
        }
        id
        namespace
        notes
        attributes {
          short_name
          value_json
        }
        publish
      }
    }
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
    allMongodbAiidprodReports(filter: { report_number: { in: $report_numbers } }) {
      nodes {
        submitters
        date_published
        report_number
        title
        description
        url
        image_url
        cloudinary_id
        source_domain
        mongodb_id
        text
        authors
        epoch_date_submitted
        language
        tags
        inputs_outputs
      }
    }
    allMongodbTranslationsReportsEs(filter: { report_number: { in: $report_numbers } })
      @include(if: $translate_es) {
      nodes {
        title
        text
        report_number
      }
    }
    allMongodbTranslationsReportsFr(filter: { report_number: { in: $report_numbers } })
      @include(if: $translate_fr) {
      nodes {
        title
        text
        report_number
      }
    }
    allMongodbTranslationsReportsJa(filter: { report_number: { in: $report_numbers } })
      @include(if: $translate_ja) {
      nodes {
        title
        text
        report_number
      }
    }
    allMongodbTranslationsReportsEn(filter: { report_number: { in: $report_numbers } })
      @include(if: $translate_en) {
      nodes {
        title
        text
        report_number
      }
    }
    incident: mongodbAiidprodIncidents(incident_id: { eq: $incident_id }) {
      incident_id
      reports {
        report_number
      }
      title
      description
      date
      editors {
        userId
        first_name
        last_name
      }
      flagged_dissimilar_incidents
      Alleged_developer_of_AI_system
      Alleged_deployer_of_AI_system
      Alleged_harmed_or_nearly_harmed_parties
      editor_notes
      implicated_systems
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

export default CitePage;
