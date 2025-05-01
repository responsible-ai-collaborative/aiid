const path = require('path');

const { computeEntities } = require('../src/utils/entities');

const createEntitiesPages = async (graphql, createPage) => {
  const {
    data: { incidents, entities: entitiesData, responses, entityRelationships, entityDuplicates },
  } = await graphql(`
    {
      incidents: allMongodbAiidprodIncidents {
        nodes {
          incident_id
          title
          Alleged_deployer_of_AI_system
          Alleged_developer_of_AI_system
          Alleged_harmed_or_nearly_harmed_parties
          implicated_systems
          reports {
            report_number
          }
        }
      }
      entities: allMongodbAiidprodEntities {
        nodes {
          entity_id
          name
        }
      }
      responses: allMongodbAiidprodReports(filter: { tags: { in: ["response"] } }) {
        nodes {
          report_number
          title
        }
      }

      entityRelationships: allMongodbAiidprodEntityRelationships(
        filter: { pred: { eq: "related" } }
      ) {
        nodes {
          sub
          obj
          is_symmetric
          pred
        }
      }
      entityDuplicates: allMongodbAiidprodEntityDuplicates {
        nodes {
          duplicate_entity_id
          true_entity_id
        }
      }
    }
  `);

  const entities = computeEntities({
    incidents: incidents.nodes,
    entities: entitiesData.nodes,
    responses: responses.nodes,
    entityRelationships: entityRelationships.nodes,
  });

  for (const entity of entities) {
    const { id } = entity;

    const pagePath = `/entities/${id}`;

    const currentEntityRelationships =
      entityRelationships.nodes.filter(
        (rel) => (rel.sub === id || rel.obj === id) && rel.is_symmetric
      ) || [];

    createPage({
      path: pagePath,
      component: path.resolve('./src/templates/entity.js'),
      context: {
        id,
        name: entity.name,
        incidentsAsDeployer: entity.incidentsAsDeployer,
        incidentsAsDeveloper: entity.incidentsAsDeveloper,
        incidentsAsBoth: entity.incidentsAsBoth,
        incidentsHarmedBy: entity.incidentsHarmedBy,
        incidentsImplicatedSystems: entity.incidentsImplicatedSystems,
        relatedEntities: entity.relatedEntities,
        responses: entity.responses,
        entityRelationships: currentEntityRelationships,
      },
    });
  }

  createPage({
    path: '/entities',
    component: path.resolve('./src/templates/entities.js'),
    context: {
      entities,
      entityRelationships: entityRelationships.nodes,
    },
  });

  // create pages for duplicated entities
  for (const { duplicate_entity_id, true_entity_id } of entityDuplicates.nodes) {
    createPage({
      path: `/entities/${duplicate_entity_id}`,
      component: path.resolve('./src/templates/entity-duplicate.js'),
      context: { duplicate_entity_id, true_entity_id },
    });
  }
};

module.exports = createEntitiesPages;
