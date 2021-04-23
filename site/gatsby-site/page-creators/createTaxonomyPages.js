const path = require('path');

const MOCK_TAXONOMY = [
  {
    namespace: 'CSET',
    description:
      'This should be a markdown document that will be rendered to HTML by the Gatsby build process',
    fields: {
      'field name 1': {
        type: 'short_string',
        default: '',
        mongotype: 'typeval',
        'short description': 'This goes in tooltips',
        'long description': 'This goes in the documentation page',
      },
      annotator: {
        type: 'string',
        'short description': 'CSET researcher applying taxonomy',
        'long description':
          'The CSET taxonomy is presently a closed taxonomy, meaning only persons affiliated with CSET are permitted to act as editors within the CSET namespace. The person indicated by the annotator field is the one who applied the taxonomy to the incident.',
      },
      '...': {},
    },
  },
];

const createTaxonomyPages = (graphql, createPage) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          query Taxonomies {
            allMongodbAiidprodIncidents {
              distinct(field: incident_id)
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          reject(result.errors);
        }

        MOCK_TAXONOMY.forEach((taxaonomy) => {
          createPage({
            path: '/taxonomy/' + taxaonomy.namespace,
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
