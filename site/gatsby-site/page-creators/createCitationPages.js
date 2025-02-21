const path = require('path');

const { switchLocalizedPath } = require('../i18n');

const createCitationPages = async (graphql, createPage, { languages }) => {
  const result = await graphql(
    `
      query IncidentIDs {
        allMongodbAiidprodIncidents(sort: { incident_id: ASC }) {
          nodes {
            incident_id
            title
            date
            reports {
              title
              report_number
              language
              image_url
              cloudinary_id
            }
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
      }
    `
  );

  const { allMongodbAiidprodIncidents } = result.data;

  const pageContexts = [];

  allMongodbAiidprodIncidents.nodes.forEach((incident, index) => {
    const incident_id = incident.incident_id;

    const nlp_similar_incidents = incident.nlp_similar_incidents.map(
      ({ incident_id, similarity }) => ({
        ...allMongodbAiidprodIncidents.nodes.find(
          (incident) => incident.incident_id === incident_id
        ),
        similarity,
      })
    );

    const editor_similar_incidents = incident.editor_similar_incidents.map((incident_id) => ({
      ...allMongodbAiidprodIncidents.nodes.find((incident) => incident.incident_id === incident_id),
    }));

    const editor_dissimilar_incidents = incident.editor_dissimilar_incidents.map((incident_id) => ({
      ...allMongodbAiidprodIncidents.nodes.find((incident) => incident.incident_id === incident_id),
    }));

    pageContexts.push({
      incident,
      incident_id,
      report_numbers: incident.reports.map((r) => r.report_number),
      nextIncident:
        index < allMongodbAiidprodIncidents.nodes.length - 1
          ? allMongodbAiidprodIncidents.nodes[index + 1].incident_id
          : null,
      prevIncident: index > 0 ? allMongodbAiidprodIncidents.nodes[index - 1].incident_id : null,
      nlp_similar_incidents,
      editor_similar_incidents,
      editor_dissimilar_incidents,
    });
  });

  for (const language of languages) {
    for (const context of pageContexts) {
      const pagePath = switchLocalizedPath({
        newLang: language.code,
        path: '/cite/' + context.incident_id + '/',
      });

      createPage({
        path: pagePath,
        component: path.resolve('./src/templates/cite.js'),
        context: {
          ...context,
          originalPath: pagePath,
          locale: language.code,
          hrefLang: language.hrefLang,
        },
      });
    }
  }
};

module.exports = createCitationPages;
