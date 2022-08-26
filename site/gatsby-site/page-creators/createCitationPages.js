const config = require('../config');

const path = require('path');

const { switchLocalizedPath } = require('../i18n');

const createCitationPages = async (graphql, createPage) => {
  const result = await graphql(
    `
      query IncidentIDs {
        allMongodbAiidprodIncidents {
          nodes {
            incident_id
            title
            description
            date
            reports
            editors
            editor_similar_incidents
            editor_dissimilar_incidents
            flagged_dissimilar_incidents
            nlp_similar_incidents {
              incident_id
              similarity
            }
          }
        }

        allMongodbAiidprodReports {
          nodes {
            report_number
            language
          }
        }
      }
    `
  );

  const { allMongodbAiidprodIncidents, allMongodbAiidprodReports } = result.data;

  // Incident reports list
  const incidentReportsMap = {};

  for (const incident of allMongodbAiidprodIncidents.nodes) {
    incidentReportsMap[incident.incident_id] = incident.reports
      .map((r) => allMongodbAiidprodReports.nodes.find((n) => n.report_number === r))
      .map((r) => ({ ...r }));
  }

  const keys = Object.keys(incidentReportsMap);

  const pageContexts = [];

  for (let i = 0; i < keys.length; i++) {
    const incident_id = parseInt(keys[i]);

    const incident = allMongodbAiidprodIncidents.nodes.find(
      (incident) => incident.incident_id === incident_id
    );

    pageContexts.push({
      incident,
      incidentReports: incidentReportsMap[incident_id],
      nextIncident: i < keys.length - 1 ? keys[i + 1] : null,
      prevIncident: i > 0 ? keys[i - 1] : null,
      nlp_similar_incidents: incident.nlp_similar_incidents.map((i) => i.incident_id),
      editor_similar_incidents: incident.editor_similar_incidents,
      editor_dissimilar_incidents: incident.editor_dissimilar_incidents,
    });
  }

  for (const language of config.i18n.availableLanguages) {
    for (const context of pageContexts) {
      const pagePath = switchLocalizedPath({
        newLang: language,
        path: '/cite/' + context.incident.incident_id,
      });

      createPage({
        path: pagePath,
        component: path.resolve('./src/templates/cite.js'),
        context: {
          ...context,
          incident_id: context.incident.incident_id,
          report_numbers: context.incident.reports,
          translate_es: incidentReportsMap[context.incident.incident_id].some(
            (r) => r.language !== 'es'
          ),
          translate_en: incidentReportsMap[context.incident.incident_id].some(
            (r) => r.language !== 'en'
          ),
        },
      });
    }
  }
};

module.exports = createCitationPages;
