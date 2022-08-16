const path = require('path');

const { updateTsneInDatabase } = require('../src/utils/updateTsne');

const createTsneVisualizationPage = async (graphql, createPage) => {
  await updateTsneInDatabase();

  createPage({
    path: 'summaries/spatial',
    component: path.resolve('./src/templates/tsneVisualizationPage.js'),
  });
};

module.exports = createTsneVisualizationPage;
