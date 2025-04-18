const path = require('path');

const { switchLocalizedPath } = require('../i18n');

const { isCompleteReport } = require('../src/utils/variants');

const createReportPages = async (graphql, createPage, { languages }) => {
  const result = await graphql(
    `
      query ReportPages {
        reports: allMongodbAiidprodReports {
          nodes {
            report_number
            language
            title
            url
            source_domain
          }
        }
      }
    `
  );

  const {
    reports: { nodes: reports },
  } = result.data;

  const pageContexts = [];

  for (const report of reports.filter((r) => isCompleteReport(r))) {
    pageContexts.push({
      report_number: report.report_number,
      language: report.language,
    });
  }

  for (const language of languages) {
    for (const context of pageContexts) {
      const pagePath = switchLocalizedPath({
        newLang: language.code,
        path: '/reports/' + context.report_number + '/',
      });

      createPage({
        path: pagePath,
        component: path.resolve('./src/templates/report.js'),
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

module.exports = createReportPages;
