const path = require('path');

const createDuplicatePages = async (graphql, createPage) => {
  const result = await graphql(
    `
      query DuplicatePages {
        allMongodbAiidprodDuplicates {
          nodes {
            true_incident_number
            duplicate_incident_number
          }
        }
      }
    `
  );

  const { allMongodbAiidprodDuplicates } = result.data;

  for (const {
    true_incident_number,
    duplicate_incident_number,
  } of allMongodbAiidprodDuplicates.nodes) {
    createPage({
      path: '/cite/' + duplicate_incident_number,
      component: path.resolve('./src/templates/cite-duplicate.js'),
      context: {
        duplicate_incident_number: parseInt(duplicate_incident_number),
        true_incident_number: parseInt(true_incident_number),
      },
    });
  }
};

module.exports = createDuplicatePages;
