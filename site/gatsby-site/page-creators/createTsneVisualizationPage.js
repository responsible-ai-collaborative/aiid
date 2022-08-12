const path = require('path');

const createTsneVisualizationPage = async (graphql, createPage) => {
  createPage({
    path: 'summaries/spatial',
    component: path.resolve('./src/templates/tsneVisualizationPage.js'),
  });
};

module.exports = createTsneVisualizationPage;
