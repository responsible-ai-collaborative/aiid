const path = require('path');

const getClassificationsArray = (classificationObj, taxonomy) => {
  const taxaFieldsArray = taxonomy.field_list.sort((a, b) => b.weight - a.weight);

  const array = [];

  const getStringForValue = (value) => {
    switch (typeof value) {
      case 'object':
        return value.join(', ');

      case 'boolean':
        return value ? 'Yes' : 'No';

      default:
        return value;
    }
  };

  taxaFieldsArray.forEach((field) => {
    const c = classificationObj[field.short_name.split(' ').join('_')];

    const value = getStringForValue(c);

    if (field.public !== false && value !== undefined && value !== '' && value.length > 0) {
      array.push({
        name: field.short_name,
        value: getStringForValue(value),
        weight: field.weight,
        shortDescription: field.short_description,
      });
    }
  });

  return array;
};

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

            allMongodbAiidprodClassifications(
              filter: { classifications: { Publish: { eq: true } } }
            ) {
              nodes {
                incident_id
                id
                namespace
                classifications {
                  Annotation_Status
                  Annotator
                  Ending_Date
                  Beginning_Date
                  Full_Description
                  Intent
                  Location
                  Named_Entities
                  Near_Miss
                  Quality_Control
                  Reviewer
                  Severity
                  Short_Description
                  Technology_Purveyor
                  AI_Applications
                  AI_System_Description
                  AI_Techniques
                  Data_Inputs
                  Finacial_Cost
                  Harm_Distribution_Basis
                  Harm_Type
                  Infrastructure_Sectors
                  Laws_Implicated
                  Level_of_Autonomy
                  Lives_Lost
                  Nature_of_End_User
                  Physical_System
                  Problem_Nature
                  Public_Sector_Deployment
                  Relevant_AI_functions
                  Sector_of_Deployment
                  System_Developer
                  Publish
                }
              }
            }

            allMongodbAiidprodTaxa {
              nodes {
                id
                namespace
                weight
                description
                field_list {
                  public
                  display_type
                  long_name
                  short_name
                  weight
                  short_description
                }
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
          allMongodbAiidprodTaxa,
        } = result.data;

        // Incident reports list
        const incidentReportsMap = {};

        result.data.allMongodbAiidprodIncidents.group.map((g) => {
          incidentReportsMap[g.fieldValue] = g.edges;
        });

        // Incident taxonomy and classifications
        allMongodbAiidprodIncidents.distinct.forEach((incident_id) => {
          const incidentClassifications = allMongodbAiidprodClassifications.nodes.filter(
            (t) => t.incident_id.toString() === incident_id
          );

          let taxonomyNamespaceArray = [];

          if (incidentClassifications && incidentClassifications.length > 0) {
            incidentClassifications.forEach((i) => {
              taxonomyNamespaceArray.push(i.namespace);
            });
          }

          taxonomyNamespaceArray = [...new Set(taxonomyNamespaceArray)];

          const filteredAllMongodbAiidprodTaxa = allMongodbAiidprodTaxa.nodes.filter((taxonomy) =>
            taxonomyNamespaceArray.includes(taxonomy.namespace)
          );

          const taxonomies = [];

          if (incidentClassifications.length > 0) {
            incidentClassifications.forEach((c) => {
              filteredAllMongodbAiidprodTaxa.forEach((t) => {
                if (c.namespace === t.namespace) {
                  taxonomies.push({
                    namespace: c.namespace,
                    classificationsArray: getClassificationsArray(c.classifications, t),
                  });
                }
              });
            });
          }

          // Create citation pages
          createPage({
            path: '/cite/' + incident_id,
            component: path.resolve('./src/templates/cite.js'),
            context: {
              incidentReports: incidentReportsMap[incident_id],
              taxonomies,
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
