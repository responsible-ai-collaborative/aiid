const path = require('path');

const { computeEntities } = require('../src/utils/entities');

const createEntitiesPages = async (graphql, createPage) => {
  const {
    data: { incidents },
  } = await graphql(`
    {
      incidents: allMongodbAiidprodIncidents {
        nodes {
          incident_id
          Alleged_deployer_of_AI_system
          Alleged_developer_of_AI_system
        }
      }
    }
  `);

  const entities = computeEntities({ incidents: incidents.nodes });

  for (const entity of entities) {
    const { id } = entity;

    const pagePath = `/entities/${id}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/templates/entity.js'),
      context: {
        id,
        name: entity.name,
        incidentsAsDeployer: entity.incidentsAsDeployer,
        incidentsAsDeveloper: entity.incidentsAsDeveloper,
        incidentsAsBoth: entity.incidentsAsBoth,
        relatedEntities: entity.relatedEntities,
      },
    });
  }

  createPage({
    path: '/entities',
    component: path.resolve('./src/templates/entities.js'),
    context: {
      entities,
    },
  });
};

module.exports = createEntitiesPages;
