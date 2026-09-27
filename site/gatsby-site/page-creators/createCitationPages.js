const path = require('path');

const { switchLocalizedPath } = require('../i18n');

const createCitationPages = async (graphql, createPage, { languages }) => {
  const result = await graphql(`
    query IncidentsAndLinks {
      allMongodbAiidprodIncidents(sort: { incident_id: ASC }) {
        nodes {
          incident_id
          title
          date
          reports {
            title
            report_number
            image_url
            cloudinary_id
          }
          editor_similar_incidents
          editor_dissimilar_incidents
          nlp_similar_incidents {
            incident_id
            similarity
          }
        }
      }
      allMongodbAiidprodIncidentLinks {
        nodes {
          incident_id
          sameAs
          source_namespace
        }
      }
      allMongodbTranslationsIncidents {
        nodes {
          incident_id
          language
          title
        }
      }
    }
  `);

  const { allMongodbAiidprodIncidents, allMongodbAiidprodIncidentLinks } = result.data;

  // Translated titles for the similar-incident cards, keyed by incident id. Attached
  // here so a localized page can show them from build-time data: the cards used to
  // fetch each title through the API, which now requires a login
  // (SEE: server/apiAccess.ts) and would leave a logged-out reader of /es/cite/…
  // with English titles — and cost one request per card for everyone else.
  const translationsByIncident = new Map();

  // Tolerates a result without the translations query (older mocks, or a build
  // with no translations database), in which case the cards fall back to the
  // English titles.
  const translationNodes = result.data.allMongodbTranslationsIncidents?.nodes ?? [];

  for (const { incident_id, language, title } of translationNodes) {
    if (!title) continue;

    if (!translationsByIncident.has(incident_id)) {
      translationsByIncident.set(incident_id, []);
    }

    translationsByIncident.get(incident_id).push({ language, title });
  }

  const similarIncident = (incident_id) => ({
    ...allMongodbAiidprodIncidents.nodes.find((incident) => incident.incident_id === incident_id),
    translations: translationsByIncident.get(incident_id) || [],
  });

  const pageContexts = [];

  allMongodbAiidprodIncidents.nodes.forEach((incident, index) => {
    const incident_id = incident.incident_id;

    const nlp_similar_incidents = incident.nlp_similar_incidents.map(
      ({ incident_id, similarity }) => ({
        ...similarIncident(incident_id),
        similarity,
      })
    );

    const editor_similar_incidents = incident.editor_similar_incidents.map((incident_id) =>
      similarIncident(incident_id)
    );

    const editor_dissimilar_incidents = incident.editor_dissimilar_incidents.map((incident_id) =>
      similarIncident(incident_id)
    );

    const linkRecords = allMongodbAiidprodIncidentLinks.nodes.filter(
      (l) => l.incident_id === incident_id
    );

    pageContexts.push({
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
      linkRecords,
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
