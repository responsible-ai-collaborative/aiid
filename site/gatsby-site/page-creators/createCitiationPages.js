const path = require('path');

const createCitiationPages = (graphql, createPage) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `query IncidentIDs {
           allMongodbAiidprodIncidents {
             distinct(field: incident_id)
               nodes {
                 incident_id
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
      })
    );
  });
}

module.exports = createCitiationPages;