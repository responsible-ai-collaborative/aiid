const { default: slugify } = require('slugify');

module.exports.computeEntities = ({ incidents }) => {
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

  for (const incident of incidents) {
    for (const field of fields) {
      for (const name of incident[field.property]) {
        const id = slugify(name, { lower: true });

        if (!entititiesHash[id]) {
          entititiesHash[id] = {
            id,
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
    entititiesHash[id].relatedEntities = incidents
      .filter((incident) =>
        fields.some((field) =>
          incident[field.property].map((p) => slugify(p, { lower: true })).includes(id)
        )
      )
      .reduce((related, incident) => {
        for (const field of fields) {
          for (const name of incident[field.property]) {
            const relatedId = slugify(name, { lower: true });

            if (relatedId !== id && !related.some((r) => r.id == relatedId)) {
              const { id, name, incidentsAsDeveloper, incidentsAsDeployer, incidentsAsBoth } =
                entititiesHash[relatedId];

              related.push({
                id,
                name,
                incidents:
                  incidentsAsDeveloper.length + incidentsAsDeployer.length - incidentsAsBoth.length,
              });
            }
          }
        }

        return related;
      }, []);
  }

  return Object.values(entititiesHash);
};
