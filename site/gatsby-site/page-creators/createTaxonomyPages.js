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
                  permitted_values
                  required
                  short_description
                  short_name
                  instant_facet
                  display_type
                }
              }
            }
            allMongodbAiidprodClassifications {
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
                  Harm_distribution_basis
                  Intent
                  Lives_lost
                  Location
                  Named_entities
                  Near_miss
                  Quality_Control
                  Reviewer
                  Severity
                  Short_Description
                  Technology_purveyor
                  AI_Applications
                  AI_System_Description
                  AI_techniques
                  Data_Inputs
                  Finacial_Cost
                  Harm_Distribution_Basis
                  Harm_Type
                  Infrastructure_Sectors
                  Laws_Implicated
                  Level_of_Autonomy
                  Lives_Lost
                  Named_Entities
                  Nature_of_End_User
                  Near_Miss
                  Physical_System
                  Problem_Nature
                  Public_Sector_Deployment
                  Relevant_AI_functions
                  Sector_of_Deployment
                  System_Developer
                  Technology_Purveyor
                }
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          reject(result.errors);
        }

        const getStats = (taxa, classification) => {
          const filtredClassification = classification.filter(
            (c) => c.namespace === taxa.namespace
          );

          const stats = {};

          taxa.field_list
            .filter((field) => field.permitted_values !== null)
            .forEach((field) => {
              let auxStat = {};

              let incidents = [];

              field.permitted_values.forEach((v) => {
                auxStat[v] = 0;
              });

              filtredClassification.forEach((c) => {
                const value = c.classifications[field.short_name.split(' ').join('_')];

                if (field.permitted_values !== null && value.length > 0) {
                  if (typeof value === 'object') {
                    value.forEach((v) => {
                      auxStat[v] = auxStat[v] || 0 + 1;
                    });
                  } else {
                    auxStat[value] = auxStat[value] + 1;
                  }
                  incidents.push({
                    [field.short_name]: value,
                  });
                }
              });

              stats[field.short_name] = auxStat;
            });
          return stats;
        };

        result.data.allMongodbAiidprodTaxa.nodes.forEach((taxonomy) => {
          const stats = getStats(taxonomy, result.data.allMongodbAiidprodClassifications.nodes);

          createPage({
            path: '/taxonomy/' + taxonomy.namespace.toLowerCase(),
            component: path.resolve('./src/templates/taxonomy.js'),
            context: {
              taxonomy,
              stats,
            },
          });
        });
      })
    );
  });
};

module.exports = createTaxonomyPages;
