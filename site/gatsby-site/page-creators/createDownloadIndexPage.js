const path = require('path');

const discoverIndex = require('../src/utils/discoverIndexGenerator');

const createDownloadIndexPage = async (graphql, createPage) => {
  const data = await discoverIndex({ graphql });

  createPage({
    path: '/downloadIndex',
    component: path.resolve('./src/templates/downloadIndex.js'),
    context: {
      data,
    },
  });
};

module.exports = createDownloadIndexPage;
