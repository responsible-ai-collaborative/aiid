const { default: slugify } = require('slugify');

const getId = (name) => slugify(name, { lower: true });

module.exports.computeEntities = ({ incidents }) => {
  const entititiesHash = {};

  const entityFields = [
    {
      property: 'Alleged_deployer_of_AI_system',
      key: 'incidentsAsDeployer',
    },
    {
      property: 'Alleged_developer_of_AI_system',
      key: 'incidentsAsDeveloper',
    },
    {
      property: 'Alleged_harmed_or_nearly_harmed_parties',
      key: 'incidentsHarmedBy',
    },
  ];

  const harmingProperties = ['Alleged_deployer_of_AI_system', 'Alleged_developer_of_AI_system'];

  const harmedProperties = ['Alleged_harmed_or_nearly_harmed_parties'];

  for (const incident of incidents) {
    const { incident_id } = incident;

    for (const field of entityFields) {
      for (const name of incident[field.property]) {
        const id = getId(name);

        if (!entititiesHash[id]) {
          entititiesHash[id] = {
            id,
            name,
            incidentsAsDeveloper: [],
            incidentsAsDeployer: [],
            incidentsAsBoth: [],
            relatedEntities: [],
            incidentsHarmedBy: [],
          };
        }

        if (harmingProperties.some((f) => f == field.property)) {
          const isBoth = harmingProperties.every((property) =>
            incident[property].some((name) => getId(name) === id)
          );

          if (isBoth) {
            if (!entititiesHash[id].incidentsAsBoth.includes(incident_id)) {
              entititiesHash[id].incidentsAsBoth.push(incident_id);
            }
          } else {
            if (!entititiesHash[id][field.key].some((i) => i.incident_id == incident_id)) {
              entititiesHash[id][field.key].push(incident_id);
            }
          }
        }

        if (harmedProperties.some((f) => f === field.property)) {
          if (!entititiesHash[id][field.key].some((i) => i.incident_id == incident_id)) {
            entititiesHash[id][field.key].push(incident_id);
          }
        }
      }
    }
  }

  for (const id in entititiesHash) {
    entititiesHash[id].relatedEntities = incidents
      .filter((incident) =>
        entityFields.some((field) =>
          incident[field.property].map((p) => slugify(p, { lower: true })).includes(id)
        )
      )
      .reduce((related, incident) => {
        for (const field of entityFields) {
          for (const name of incident[field.property]) {
            const relatedId = getId(name);

            if (relatedId !== id && !related.some((r) => r == relatedId)) {
              related.push(relatedId);
            }
          }
        }

        return related;
      }, []);
  }

  return Object.values(entititiesHash);
};
