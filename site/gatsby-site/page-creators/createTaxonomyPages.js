const path = require('path');

const createTaxonomyPages = (graphql, createPage) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          query Taxonomies {
            allMongodbAiidprodTaxa {
              nodes {
                namespace
                description
                field_list {
                  long_name
                  long_description
                  weight
                }
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          reject(result.errors);
        }

        result.data.allMongodbAiidprodTaxa.nodes.forEach((taxaonomy) => {
          createPage({
            path: '/taxonomy/' + taxaonomy.namespace.toLowerCase(),
            component: path.resolve('./src/templates/taxonomy.js'),
            context: {
              taxaonomy,
            },
          });
        });
      })
    );
  });
};

module.exports = createTaxonomyPages;
