const path = require('path');

const { switchLocalizedPath } = require('../i18n');

const createReportPages = async (graphql, createPage, { languages }) => {
  const result = await graphql(
    `
      query ReportPages {
        reports: allMongodbAiidprodReports(filter: { is_incident_report: { eq: false } }) {
          nodes {
            report_number
            language
          }
        }
      }
    `
  );

  const {
    reports: { nodes: reports },
  } = result.data;

  const pageContexts = [];

  for (const report of reports) {
    pageContexts.push({
      report_number: report.report_number,
      language: report.language,
    });
  }

  for (const language of languages) {
    for (const context of pageContexts) {
      const pagePath = switchLocalizedPath({
        newLang: language.code,
        path: '/reports/' + context.report_number,
      });

      createPage({
        path: pagePath,
        component: path.resolve('./src/templates/report.js'),
        context: {
          ...context,
          originalPath: pagePath,
          locale: language.code,
          hrefLang: language.hrefLang,
          translate_es: context.language !== 'es',
          translate_fr: context.language !== 'fr',
          translate_en: context.language !== 'en',
        },
      });
    }
  }
};

module.exports = createReportPages;
