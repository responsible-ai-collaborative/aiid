const config = require('../config');

const path = require('path');

const { updateTsneInDatabase } = require('../src/utils/updateTsne');

const { switchLocalizedPath } = require('../i18n');

const createTsneVisualizationPage = async (graphql, createPage) => {
  await updateTsneInDatabase();

  const csetClassifications = [
    'Sector of Deployment',
    'Harm Distribution Basis',
    'Severity',
    'Harm Type',
    'Intent',
    'Near Miss',
    'Problem Nature',
    'System Developer',
  ];

  const result = await graphql(`
    query SpatialIncidents {
      allMongodbAiidprodIncidents(filter: { tsne: { x: { ne: null }, y: { ne: null } } }) {
        nodes {
          incident_id
          title
          tsne {
            x
            y
          }
        }
      }
    }
  `);

  const spatialIncidents = result.data.allMongodbAiidprodIncidents.nodes;

  const incidentIds = spatialIncidents.map((incident) => incident.incident_id);

  const classificationsQuery = await graphql(`
    query Classifications {
      allMongodbAiidprodClassifications(filter: { incidents: { elemMatch: { incident_id: { in: [${incidentIds}] } } } }, limit: 9999999) {
        nodes {
          incidents {
            incident_id
          }
          namespace
          attributes {
            short_name
            value_json 
          }
          publish
        }
      }
    }
  `);

  const taxaQuery = await graphql(`
    query Taxa {
      allMongodbAiidprodTaxa(limit: 9999999) {
        nodes {
          namespace
          field_list {
            short_name
            hide_search
          }
        }
      }
    }
  `);

  const classificationNodes = classificationsQuery.data.allMongodbAiidprodClassifications.nodes;

  const classifications = classificationNodes.filter((c) => c.publish);

  const taxa = taxaQuery.data.allMongodbAiidprodTaxa.nodes;

  for (const language of config.i18n.availableLanguages) {
    const pagePath = switchLocalizedPath({
      newLang: language,
      path: 'summaries/spatial',
    });

    createPage({
      path: pagePath,
      component: path.resolve('./src/templates/tsneVisualizationPage.js'),
      context: {
        spatialIncidents,
        classifications,
        taxa,
        csetClassifications,
      },
    });
  }
};

module.exports = createTsneVisualizationPage;
