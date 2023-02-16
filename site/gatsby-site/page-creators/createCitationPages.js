const path = require('path');

const { switchLocalizedPath } = require('../i18n');

const createCitationPages = async (graphql, createPage, { languages }) => {
  const result = await graphql(
    `
      query IncidentIDs {
        allMongodbAiidprodIncidents {
          nodes {
            incident_id
            title
            date
            reports
            editor_similar_incidents
            editor_dissimilar_incidents
            flagged_dissimilar_incidents
            description
            nlp_similar_incidents {
              incident_id
              similarity
            }
          }
        }

        allMongodbAiidprodReports(filter: { is_incident_report: { eq: true } }) {
          nodes {
            title
            report_number
            language
            image_url
            cloudinary_id
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

    const nlp_similar_incidents = incident.nlp_similar_incidents.map(
      ({ incident_id, similarity }) => ({
        ...allMongodbAiidprodIncidents.nodes.find(
          (incident) => incident.incident_id === incident_id
        ),
        similarity,
        reports: incidentReportsMap[incident_id],
      })
    );

    const editor_similar_incidents = incident.editor_similar_incidents.map((incident_id) => ({
      ...allMongodbAiidprodIncidents.nodes.find((incident) => incident.incident_id === incident_id),
      reports: incidentReportsMap[incident_id],
    }));

    const editor_dissimilar_incidents = incident.editor_dissimilar_incidents.map((incident_id) => ({
      ...allMongodbAiidprodIncidents.nodes.find((incident) => incident.incident_id === incident_id),
      reports: incidentReportsMap[incident_id],
    }));

    pageContexts.push({
      incident,
      incident_id,
      report_numbers: incident.reports,
      nextIncident: i < keys.length - 1 ? keys[i + 1] : null,
      prevIncident: i > 0 ? keys[i - 1] : null,
      nlp_similar_incidents,
      editor_similar_incidents,
      editor_dissimilar_incidents,
    });
  }

  for (const language of languages) {
    for (const context of pageContexts) {
      const pagePath = switchLocalizedPath({
        newLang: language.code,
        path: '/cite/' + context.incident_id,
      });

      createPage({
        path: pagePath,
        component: path.resolve('./src/templates/cite.js'),
        context: {
          ...context,
          originalPath: pagePath,
          locale: language.code,
          hrefLang: language.hrefLang,
          translate_es: incidentReportsMap[context.incident_id].some((r) => r.language !== 'es'),
          translate_fr: incidentReportsMap[context.incident_id].some((r) => r.language !== 'fr'),
          translate_en: incidentReportsMap[context.incident_id].some((r) => r.language !== 'en'),
        },
      });
    }
  }
};

module.exports = createCitationPages;
