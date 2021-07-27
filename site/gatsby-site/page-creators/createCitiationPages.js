const path = require('path');

const createCitiationPages = (graphql, createPage) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          query IncidentIDs {
            allMongodbAiidprodIncidents {
              distinct(field: incident_id)
              group(field: incident_id) {
                fieldValue
                edges {
                  node {
                    id
                    submitters
                    incident_date
                    date_published
                    incident_id
                    report_number
                    title
                    url
                    image_url
                    source_domain
                    mongodb_id
                    text
                    authors
                  }
                }
              }
            }

            allMongodbAiidprodClassifications(filter: { incident_id: { gt: 0 } }) {
              nodes {
                namespace
                incident_id
              }
            }

            allMongodbAiidprodDuplicates {
              nodes {
                true_incident_number
                duplicate_incident_number
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          console.log(result.errors); // eslint-disable-line no-console
          reject(result.errors);
        }

        const {
          allMongodbAiidprodIncidents,
          allMongodbAiidprodClassifications,
          allMongodbAiidprodDuplicates,
        } = result.data;

        const incidentReportsMap = {};

        result.data.allMongodbAiidprodIncidents.group.map((g) => {
          incidentReportsMap[g.fieldValue] = g.edges;
        });

        // Create citation pages
        allMongodbAiidprodIncidents.distinct.forEach((incident_id) => {
          const incidentsTaxaNamespace = allMongodbAiidprodClassifications.nodes.filter(
            (t) => t.incident_id.toString() === incident_id
          );

          let taxonomyNamespaceArray = [];

          if (incidentsTaxaNamespace && incidentsTaxaNamespace.length > 0) {
            incidentsTaxaNamespace.forEach((i) => {
              taxonomyNamespaceArray.push(i.namespace);
            });
          }
          createPage({
            path: '/cite/' + incident_id,
            component: path.resolve('./src/templates/cite.js'),
            context: {
              incidentReports: incidentReportsMap[incident_id],
              taxonomy_namespace_array: taxonomyNamespaceArray,
              incident_id: parseInt(incident_id),
            },
          });
        });

        // Create redirects
        allMongodbAiidprodDuplicates.nodes.forEach(
          ({ true_incident_number, duplicate_incident_number }) => {
            createPage({
              path: '/cite/' + duplicate_incident_number,
              component: path.resolve('./src/templates/cite-duplicate.js'),
              context: {
                duplicate_incident_number: parseInt(duplicate_incident_number),
                true_incident_number: parseInt(true_incident_number),
              },
            });
          }
        );
      })
    );
  });
};

module.exports = createCitiationPages;
