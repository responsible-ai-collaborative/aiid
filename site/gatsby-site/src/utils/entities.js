const idHash = {};

const getName = (entities, id) => {
  if (!idHash[id]) {
    const entity = entities.find((entity) => entity.entity_id == id);

    idHash[id] = entity ? entity.name : id;
  }

  return idHash[id];
};

module.exports.computeEntities = ({ incidents, entities }) => {
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
      for (const id of incident[field.property]) {
        const name = getName(entities, id);

        if (!entititiesHash[id]) {
          entititiesHash[id] = {
            id,
            name,
            incidentsAsDeveloper: [],
            incidentsAsDeployer: [],
            incidentsAsBoth: [],
            relatedEntities: [],
            incidentsHarmedBy: [],
            harmedEntities: [],
          };
        }

        if (harmingProperties.some((f) => f == field.property)) {
          const isBoth = harmingProperties.every((property) =>
            incident[property].some((entityId) => entityId === id)
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
      .filter((incident) => entityFields.some((field) => incident[field.property].includes(id)))
      .reduce((related, incident) => {
        for (const field of entityFields) {
          for (const relatedId of incident[field.property]) {
            if (relatedId !== id && !related.some((r) => r == relatedId)) {
              related.push(relatedId);
            }
          }
        }

        return related;
      }, []);

    entititiesHash[id].harmedEntities = incidents
      .filter((incident) =>
        [
          ...entititiesHash[id].incidentsAsBoth,
          ...entititiesHash[id].incidentsAsDeployer,
          ...entititiesHash[id].incidentsAsDeveloper,
        ].includes(incident.incident_id)
      )
      .reduce((harmed, incident) => {
        for (const property of harmedProperties) {
          for (const harmedId of incident[property]) {
            if (harmedId !== id && !harmed.some((r) => r == harmedId)) {
              harmed.push(harmedId);
            }
          }
        }

        return harmed;
      }, []);
  }

  return Object.values(entititiesHash);
};

module.exports.makeIncidentsHash = (incidents) =>
  incidents.reduce((hash, incident) => {
    hash[incident.incident_id] = incident;
    return hash;
  }, {});

module.exports.makeEntitiesHash = (entities) =>
  entities.reduce((hash, entity) => {
    hash[entity.id] = entity;
    return hash;
  }, {});
