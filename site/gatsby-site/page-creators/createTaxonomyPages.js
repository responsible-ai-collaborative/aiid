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
                  public
                  long_name
                  long_description
                  weight
                  permitted_values
                  required
                  short_description
                  short_name
                  instant_facet
                  display_type
                }
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          reject(result.errors);
        }

        // We can add here a redirect to the template with the right classification fragment
        result.data.allMongodbAiidprodTaxa.nodes.forEach((taxonomy) => {
          createPage({
            path: '/taxonomy/' + taxonomy.namespace.toLowerCase(),
            component: path.resolve('./src/templates/taxonomy.js'),
            context: {
              namespace: taxonomy.namespace,
              taxonomy,
            },
          });
        });
      })
    );
  });
};

module.exports = createTaxonomyPages;
