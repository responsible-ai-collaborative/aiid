const config = require('../config');

const path = require('path');

const { cloneDeep } = require('lodash');

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
            embedding {
              vector
            }
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

  const similarIncidentKeys = [
    'nlp_similar_incidents',
    'editor_similar_incidents',
    'editor_dissimilar_incidents',
  ];

  for (let i = 0; i < keys.length; i++) {
    const incident_id = parseInt(keys[i]);

    const incident = allMongodbAiidprodIncidents.nodes.find(
      (incident) => incident.incident_id === incident_id
    );

    const similarIncidents = {};

    for (let key of similarIncidentKeys) {
      similarIncidents[key] = incident[key].map((similarIncident) => {
        const similarIncidentId = similarIncident.incident_id || similarIncident;

        const foundFullIncident = allMongodbAiidprodIncidents.nodes.find(
          (fullIncident) => fullIncident.incident_id === similarIncidentId
        );

        return {
          title: foundFullIncident?.title || null,
          date: foundFullIncident?.date || null,
          incident_id: similarIncidentId,
          reports: incidentReportsMap[similarIncidentId],
        };
      });
    }

    pageContexts.push({
      incident,
      incidentReports: incidentReportsMap[incident_id],
      nextIncident: i < keys.length - 1 ? keys[i + 1] : null,
      prevIncident: i > 0 ? keys[i - 1] : null,
      similarIncidents,
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

      const translatedSimilarIncidents = {};

      for (const key of similarIncidentKeys) {
        const incidents = context.similarIncidents[key];

        translatedSimilarIncidents[key] = incidents.map((incident) => ({
          ...incident,
          reports: incident.reports
            ? incident.reports.map((report) => ({
                ...report,
                ...translations.find((t) => t.report_number == report.report_number),
              })) || incident.reports
            : [],
        }));
      }

      createPage({
        path: pagePath,
        component: path.resolve('./src/templates/cite.js'),
        context: {
          incident_id: context.incident.incident_id,
          ...context,
          incidentReports,
          ...translatedSimilarIncidents,
          similarIncidents: translatedSimilarIncidents,
        },
      });
    }
  }
};

module.exports = createCitationPages;
