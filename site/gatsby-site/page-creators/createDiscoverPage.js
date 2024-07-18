const path = require('path');

const createDiscoverPage = async (graphql, createPage) => {
  const pageQuery = await graphql(`
    query DiscoverPageQuery {
      reports: allMongodbAiidprodReports {
        nodes {
          report_number
          date_published
        }
      }
    }
  `);

  const reports = pageQuery.data.reports?.nodes;

  const numBins = 16;

  const histogramBins = new Array(numBins).fill().map(() => 0);

  const publishDates = reports.map((report) => new Date(report.date_published));

  const latestPublishDate = Math.max(...publishDates);

  const earliestPublishDate = Math.min(...publishDates);

  for (const publishDate of publishDates) {
    const position =
      (publishDate - earliestPublishDate) / (latestPublishDate - earliestPublishDate);

    const index = Math.round(position * (histogramBins.length - 1));

    histogramBins[index] += 1;
  }

  createPage({
    path: '/apps/discover/',
    component: path.resolve('./src/templates/discover.js'),
    context: { histogramBins },
  });
};

module.exports = createDiscoverPage;
