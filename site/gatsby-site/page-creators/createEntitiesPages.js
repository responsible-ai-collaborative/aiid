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

  const fields = [
    {
      property: 'Alleged_deployer_of_AI_system',
      key: 'incidentsAsDeployer',
    },
    {
      property: 'Alleged_developer_of_AI_system',
      key: 'incidentsAsDeveloper',
    },
  ];

  for (const incident of incidents.nodes) {
    for (const field of fields) {
      for (const name of incident[field.property]) {
        const id = slugify(name, { lower: true });

        if (!entititiesHash[id]) {
          entititiesHash[id] = {
            name,
            incidentsAsDeveloper: [],
            incidentsAsDeployer: [],
            incidentsAsBoth: [],
            relatedEntities: [],
          };
        }

        if (!entititiesHash[id][field.key].includes(incident.incident_id)) {
          entititiesHash[id][field.key].push(incident.incident_id);
        }

        if (fields.every((f) => entititiesHash[id][f.key].includes(incident.incident_id))) {
          entititiesHash[id].incidentsAsBoth.push(incident.incident_id);
        }
      }
    }
  }

  for (const id in entititiesHash) {
    entititiesHash[id].relatedEntities = incidents.nodes
      .filter((incident) =>
        fields.some((field) =>
          incident[field.property].map((p) => slugify(p, { lower: true })).includes(id)
        )
      )
      .reduce((related, incident) => {
        for (const field of fields) {
          for (const name of incident[field.property]) {
            const relatedId = slugify(name, { lower: true });

            if (relatedId !== id && !related.includes(relatedId)) {
              related.push(relatedId);
            }
          }
        }

        return related;
      }, []);
  }

  for (const id in entititiesHash) {
    const entity = entititiesHash[id];

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
      entititiesHash,
    },
  });
};

module.exports = createEntitiesPages;
