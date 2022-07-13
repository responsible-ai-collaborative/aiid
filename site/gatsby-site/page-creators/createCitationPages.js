const config = require('../config');

const path = require('path');

const { cloneDeep } = require('lodash');

const { switchLocalizedPath } = require('../i18n');

const axios = require('axios');

const TSNE = require('tsne-js');

const getClassificationsArray = (incidentClassifications, taxonomy) => {
  const classifications = incidentClassifications.filter(
    (c) => c.namespace === taxonomy.namespace
  )[0];

  if (!classifications) {
    return [];
  }
  const classificationObj = classifications.classifications;

  const taxaFieldsArray = taxonomy.field_list.sort((a, b) => b.weight - a.weight);

  const array = [];

  const getStringForValue = (value) => {
    if (value === null) {
      return '';
    }

    switch (typeof value) {
      case 'object':
        return value.join(', ');

      case 'boolean':
        return value ? 'Yes' : 'No';

      default:
        return value;
    }
  };

  taxaFieldsArray.forEach((field) => {
    const c = classificationObj[field.short_name.split(' ').join('_')];

    const value = getStringForValue(c);

    if (field.public !== false && value !== undefined && value !== '' && value.length > 0) {
      array.push({
        name: field.short_name,
        value: getStringForValue(value),
        weight: field.weight,
        longDescription: field.long_description,
        shortDescription: field.short_description,
        renderAs: field.render_as,
      });
    }
  });

  return array;
};

const createCitationPages = async (graphql, createPage) => {
  const result = await graphql(
    `
      query IncidentIDs {
        allMongodbAiidprodIncidents {
          nodes {
            incident_id
            date
            reports
            editors
          }
        }

        allMongodbAiidprodReports {
          nodes {
            submitters
            date_published
            report_number
            title
            url
            image_url
            cloudinary_id
            source_domain
            mongodb_id
            text
            authors
            epoch_date_submitted
            language
          }
        }

        allMongodbAiidprodClassifications(filter: { classifications: { Publish: { eq: true } } }) {
          nodes {
            incident_id
            id
            namespace
            notes
            classifications {
              Annotation_Status
              Annotator
              Ending_Date
              Beginning_Date
              Full_Description
              Intent
              Location
              Named_Entities
              Near_Miss
              Quality_Control
              Reviewer
              Severity
              Short_Description
              Technology_Purveyor
              AI_Applications
              AI_System_Description
              AI_Techniques
              Data_Inputs
              Financial_Cost
              Harm_Distribution_Basis
              Harm_Type
              Infrastructure_Sectors
              Laws_Implicated
              Level_of_Autonomy
              Lives_Lost
              Nature_of_End_User
              Physical_System
              Problem_Nature
              Public_Sector_Deployment
              Relevant_AI_functions
              Sector_of_Deployment
              System_Developer
              Publish
            }
          }
        }

        allMongodbAiidprodResources(filter: { classifications: { Publish: { eq: true } } }) {
          nodes {
            id
            incident_id
            notes
            classifications {
              Datasheets_for_Datasets
              Publish
            }
          }
        }

        allMongodbAiidprodTaxa {
          nodes {
            id
            namespace
            weight
            description
            field_list {
              public
              display_type
              long_name
              short_name
              long_description
              weight
              short_description
              render_as
            }
          }
        }
      }
    `
  );

  const {
    allMongodbAiidprodIncidents,
    allMongodbAiidprodReports,
    allMongodbAiidprodClassifications,
    allMongodbAiidprodTaxa,
    allMongodbAiidprodResources,
  } = result.data;

  // Incident reports list
  const incidentReportsMap = {};

  for (const incident of allMongodbAiidprodIncidents.nodes) {
    incidentReportsMap[incident.incident_id] = incident.reports
      .map((r) => allMongodbAiidprodReports.nodes.find((n) => n.report_number === r))
      .map((r) => ({ ...r }));
  }

  const allClassifications = [
    ...allMongodbAiidprodClassifications.nodes.map((r) => ({ ...r, namespace: 'CSET' })),
    ...allMongodbAiidprodResources.nodes.map((r) => ({ ...r, namespace: 'resources' })),
  ];

  console.log('allClassifications', allClassifications);

  let spatialIncidents;

  const nlpStateResponse = await axios.get(
    'https://raw.githubusercontent.com/responsible-ai-collaborative/nlp-lambdas/main/inference/db_state/state.csv'
  );

  if (nlpStateResponse?.status == 200) {
    const lines = nlpStateResponse.data
      .split('\n')
      .slice(1)
      .filter((line) => line.length > 2);

    const embeddings = lines.map((line) => JSON.parse(line.split('"')[1]));

    const ids = lines.map((line) => line.split(',')[0]);

    const model = new TSNE({
      dim: 2,
      perplexity: 30.0,
      earlyExaggeration: 3.0,
      learningRate: 100.0,
      nIter: 10000,
      metric: 'euclidean',
    });

    // inputData is a nested array which can be converted into an ndarray
    // alternatively, it can be an array of coordinates (second argument should be specified as 'sparse')
    model.init({
      data: embeddings,
      type: 'dense',
    });

    // `error`,  `iter`: final error and iteration number
    // note: computation-heavy action happens here
    const [err, iter] = model.run();

    if (err) {
      console.error(err, iter);
    }

    // `outputScaled` is `output` scaled to a range of [-1, 1]
    const outputScaled = model.getOutputScaled();

    spatialIncidents = outputScaled.map((array, i) => {
      const spatialIncident = {
        incident_id: ids[i],
        x: array[0],
        y: array[1],
        classifications: allClassifications.find((c) => c.incident_id == ids[i]),
      };

      return spatialIncident;
    });
  } else {
    console.error('Could not download embedding state, skipping TSNE visualization.');
  }

  const keys = Object.keys(incidentReportsMap);

  const pageContexts = [];

  for (let i = 0; i < keys.length; i++) {
    const incident_id = parseInt(keys[i]);

    const incident = allMongodbAiidprodIncidents.nodes.find(
      (incident) => incident.incident_id === incident_id
    );

    const incidentClassifications = allClassifications.filter((t) => t.incident_id === incident_id);

    const taxonomies = [];

    allMongodbAiidprodTaxa.nodes.forEach((t) => {
      const notes = incidentClassifications.find((c) => c.namespace === t.namespace)?.notes;

      taxonomies.push({
        notes,
        namespace: t.namespace,
        classificationsArray: getClassificationsArray(incidentClassifications, t),
        taxonomyFields: t.field_list,
      });
    });

    pageContexts.push({
      incident,
      incidentReports: incidentReportsMap[incident_id],
      taxonomies,
      nextIncident: i < keys.length - 1 ? keys[i + 1] : null,
      prevIncident: i > 0 ? keys[i - 1] : null,
      spatialIncidents,
    });
  }

  for (const language of config.i18n.availableLanguages) {
    const { data: { translations: { nodes: translations } } = { translations: { nodes: [] } } } =
      await graphql(`
    {
      translations: allMongodbTranslationsReports${language[0].toUpperCase()}${language.slice(1)} {
        nodes  {
          report_number
          title
          text
        }
      }
    }`);

    for (const context of pageContexts) {
      const pagePath = switchLocalizedPath({
        newLang: language,
        path: '/cite/' + context.incident.incident_id,
      });

      const incidentReports = context.incidentReports.map((r) => {
        let report = cloneDeep(r);

        if (report.language !== language) {
          const translation = translations.find((t) => t.report_number == report.report_number);

          if (translation) {
            const { title, text } = translation;

            report = { ...report, title, text };
          } else {
            console.warn(`Missing translation for report ${report.report_number}`);
          }
        }

        return report;
      });

      createPage({
        path: pagePath,
        component: path.resolve('./src/templates/cite.js'),
        context: {
          ...context,
          incidentReports,
        },
      });
    }
  }
};

module.exports = createCitationPages;
