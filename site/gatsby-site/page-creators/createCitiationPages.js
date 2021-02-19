const path = require('path');

const createCitiationPages = (graphql, createPage) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `query IncidentIDs {
           allMongodbAiidprodIncidents {
             distinct(field: incident_id)
            }
            allMongodbAiidprodDuplicates {
              nodes{
                true_incident_number
                duplicate_incident_number
              }
            }
         }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors); // eslint-disable-line no-console
          reject(result.errors);
        }

        // Create citation pages
        result.data.allMongodbAiidprodIncidents.distinct.forEach((incident_id) => {
          createPage({
            path: '/cite/' + incident_id,
            component: path.resolve('./src/templates/cite.js'),
            context: {
              incident_id: parseInt(incident_id),
            },
          });
        });

        // Create redirects
        result.data.allMongodbAiidprodDuplicates.nodes.forEach(({true_incident_number, duplicate_incident_number}) => {
          createPage({
            path: '/cite/' + duplicate_incident_number,
            component: path.resolve('./src/templates/cite-duplicate.js'),
            context: {
              duplicate_incident_number: parseInt(duplicate_incident_number),
              true_incident_number: parseInt(true_incident_number)
            },
          });
        });

      })
    );
  });
}

module.exports = createCitiationPages;