const { default: slugify } = require('slugify');

const path = require('path');

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

  const entititiesHash = {};

  const fields = ['Alleged_deployer_of_AI_system', 'Alleged_developer_of_AI_system'];

  for (const incident of incidents.nodes) {
    for (const field of fields) {
      for (const name of incident[field]) {
        const id = slugify(name, { lower: true });

        if (!entititiesHash[id]) {
          entititiesHash[id] = { incidents: [] };
        }

        if (!entititiesHash[id].incidents.includes(incident.incident_id)) {
          entititiesHash[id].incidents.push(incident.incident_id);
        }
      }
    }
  }

  for (const key in entititiesHash) {
    const entity = entititiesHash[key];

    const pagePath = `/entities/${key}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/templates/entity.js'),
      context: {
        key,
        incidents: entity.incidents,
      },
    });
  }
};

module.exports = createEntitiesPages;
