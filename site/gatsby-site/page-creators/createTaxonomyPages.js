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
            allMongodbAiidprodClassifications(filter: { incident_id: { lt: 1000 } }) {
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
          const incrementStat = (stat, val) => {
            if (val === undefined || val === null || val === '') {
              return 0;
            }

            let current = stat[val];

            if (current) {
              return current + 1;
            }

            return 1;
          };

          const validateString = (v) => {
            let vClean = v;

            if (vClean.includes('-')) {
              vClean = vClean.split('-').join('_');
            }

            if (vClean.includes('#')) {
              vClean = vClean.replace('#', '');
            }

            if (vClean.includes('(')) {
              vClean = vClean.replace('(', '');
            }

            if (vClean.includes(')')) {
              vClean = vClean.replace(')', '');
            }

            vClean = vClean.replace(/[^\w\s]/gi, '');
            return vClean;
          };

          const filtredClassification = classification.filter(
            (c) => c.namespace === taxa.namespace
          );

          const stats = {};

          taxa.field_list
            .filter((field) => field.permitted_values !== null)
            .forEach((field) => {
              let auxStat = {};

              filtredClassification.forEach((c) => {
                const value = c.classifications[field.short_name.split(' ').join('_')];

                if (value.length > 0) {
                  if (typeof value === 'object') {
                    value.forEach((v) => {
                      auxStat[v] = incrementStat(auxStat, v);
                    });
                  } else {
                    auxStat[value] = incrementStat(auxStat, value);
                  }
                }
              });

              if (Object.entries(auxStat).length !== 0) {
                stats[field.short_name] = auxStat;
              }
            });

          // TODO add another filter clause that will elimintate stats for
          // fields that are not supporse to be visible to the end user
          taxa.field_list
            .filter((field) => field.permitted_values === null)
            .forEach((field) => {
              let auxStat = {};

              filtredClassification.forEach((c) => {
                const value = c.classifications[field.short_name.split(' ').join('_')];

                if (value && value !== '') {
                  if (typeof value === 'boolean') {
                    auxStat[value] = incrementStat(auxStat, value);
                  }

                  if (field.display_type === 'bool' && typeof value !== 'boolean') {
                    auxStat[value] = incrementStat(auxStat, value === 'No' ? false : true);
                  }

                  if (typeof value === 'object') {
                    value
                      .filter((v) => v !== '')
                      .forEach((v) => {
                        const vClean = validateString(v);

                        auxStat[vClean] = incrementStat(auxStat, vClean);
                      });
                  }

                  if (field.display_type === 'list' && typeof value !== 'object') {
                    const vClean = validateString(value);

                    auxStat[vClean] = incrementStat(auxStat, vClean);
                  }

                  if (field.short_name === 'Location') {
                    const vClean = validateString(value);

                    auxStat[vClean] = incrementStat(auxStat, vClean);
                  }
                }
              });

              if (Object.keys(auxStat).length !== 0) {
                stats[field.short_name] = auxStat;
              }
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
