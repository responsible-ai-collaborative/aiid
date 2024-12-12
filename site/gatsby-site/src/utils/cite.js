import { isAfter, isEqual } from 'date-fns';
import { Operation, diff } from 'json-diff-ts';

export const getClassificationsArray = (incidentClassifications, taxonomy) => {
  const classifications = incidentClassifications.filter(
    (c) => c?.namespace === taxonomy.namespace
  )[0];

  if (!classifications) {
    return [];
  }
  const attributes = classifications.attributes;

  const taxaFieldsArray = taxonomy.field_list.sort((a, b) => b.weight - a.weight);

  const array = [];

  const getStringForValue = (value, field) => {
    if (value === null) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      return String(value);
    }
    if (Array.isArray(value)) {
      return value.map((v) => getStringForValue(v, field)).join(', ');
    }
    if (typeof value === 'object' && value.attributes) {
      const subfieldTaxonomy = { field_list: field.subfields, namespace: taxonomy.namespace };

      const subclassificationArray = getClassificationsArray(
        [{ ...value, namespace: taxonomy.namespace }],
        subfieldTaxonomy
      );

      return (
        '(' +
        subclassificationArray.map((c) => `${c.name}: ${getStringForValue(c.value)}`).join(',\n') +
        ')'
      );
    }
    if (typeof value === 'object' && !value.attributes) {
      return JSON.stringify(value);
    }
    return '';
  };

  taxaFieldsArray.forEach((field) => {
    const attribute = attributes && attributes.find((a) => a && a.short_name == field.short_name);

    const attributeValue = attribute?.value_json && JSON.parse(attribute.value_json);

    const value = getStringForValue(attributeValue, field);

    if (field.public !== false && value !== undefined && value !== '' && value.length > 0) {
      array.push({
        name: field.short_name,
        value: getStringForValue(value),
        weight: field.weight,
        longDescription: field.long_description,
        shortDescription: field.short_description,
        renderAs: field.render_as,
      });
    }
  });

  return array;
};

export const getTaxonomies = ({ allMongodbAiidprodClassifications, allMongodbAiidprodTaxa }) => {
  const incidentClassifications = allMongodbAiidprodClassifications.nodes;

  const taxonomies = [];

  allMongodbAiidprodTaxa.nodes.forEach((t) => {
    const notes = incidentClassifications.find((c) => c?.namespace === t.namespace)?.notes;

    const publish = incidentClassifications.find((c) => c?.namespace === t.namespace)?.publish;

    taxonomies.push({
      notes,
      publish,
      namespace: t.namespace,
      classificationsArray: getClassificationsArray(incidentClassifications, t),
      taxonomyFields: t.field_list,
      dummyFields: t.dummy_fields,
      complete_entities: t.complete_entities,
    });
  });

  return taxonomies;
};

export const getTranslatedReports = ({ allMongodbAiidprodReports, translations, locale }) => {
  return allMongodbAiidprodReports.nodes.map((r) => {
    const translation = translations[locale]?.nodes.find(
      (t) => t.report_number === r.report_number
    );

    return translation
      ? {
          ...r,
          text: translation.text,
          title: translation.title,
          isTranslated: true, // Mark badge to display or not
        }
      : { ...r };
  });
};

export const sortIncidentsByDatePublished = (incidentReports) => {
  return incidentReports.sort((a, b) => {
    const dateA = new Date(a.date_published);

    const dateB = new Date(b.date_published);

    if (isEqual(dateA, dateB)) {
      return 0;
    }
    if (isAfter(dateA, dateB)) {
      return 1;
    }
    if (isAfter(dateB, dateA)) {
      return -1;
    }
  });
};

// Transforms the data from the graphql query into a History_incidentInsertInput format
export const transformIncidentData = (incident, user) => {
  const result = {
    ...incident,
    __typename: undefined,
  };

  const {
    AllegedDeployerOfAISystem,
    AllegedDeveloperOfAISystem,
    AllegedHarmedOrNearlyHarmedParties,
    implicated_systems,
    reports,
    embedding,
    nlp_similar_incidents,
    tsne,
    editors,
  } = incident;

  if (AllegedDeployerOfAISystem) {
    result.AllegedDeployerOfAISystem = AllegedDeployerOfAISystem.link
      ? AllegedDeployerOfAISystem.link
      : AllegedDeployerOfAISystem.map((e) => e.entity_id);
  }

  if (AllegedDeveloperOfAISystem) {
    result.AllegedDeveloperOfAISystem = AllegedDeveloperOfAISystem.link
      ? AllegedDeveloperOfAISystem.link
      : AllegedDeveloperOfAISystem.map((e) => e.entity_id);
  }

  if (AllegedHarmedOrNearlyHarmedParties) {
    result.AllegedHarmedOrNearlyHarmedParties = AllegedHarmedOrNearlyHarmedParties.link
      ? AllegedHarmedOrNearlyHarmedParties.link
      : AllegedHarmedOrNearlyHarmedParties.map((e) => e.entity_id);
  }

  if (implicated_systems) {
    result.implicated_systems = implicated_systems.link
      ? implicated_systems.link
      : implicated_systems.map((e) => e.entity_id);
  }

  result.reports = reports
    ? reports.link
      ? reports.link
      : reports.map((r) => r.report_number)
    : [];
  result.nlp_similar_incidents = nlp_similar_incidents
    ? nlp_similar_incidents.map((nlp) => {
        return { ...nlp, __typename: undefined };
      })
    : [];

  if (embedding) {
    result.embedding = { ...embedding, __typename: undefined };
  }

  if (tsne) {
    result.tsne = { ...tsne, __typename: undefined };
  }

  if (editors) {
    result.editors = editors.link ? editors.link : editors.map((editor) => editor.userId);
  }

  // Set the user as the last modifier
  result.modifiedBy = user && user.providerType != 'anon-user' ? user.id : '';

  return result;
};

// Deletes the __typename field from the incident object
export const deleteIncidentTypenames = (incident) => {
  delete incident.__typename;
  delete incident.embedding?.__typename;
  delete incident.tsne?.__typename;
  incident.nlp_similar_incidents?.forEach((x) => {
    delete x.__typename;
  });

  return incident;
};

const INCIDENT_TO_COMPARE = {
  title: 'Title',
  description: 'Description',
  date: 'Date',
  AllegedDeployerOfAISystem: 'Alleged Deployer of AI System',
  AllegedDeveloperOfAISystem: 'Alleged Developer of AI System',
  AllegedHarmedOrNearlyHarmedParties: 'Alleged Harmed or Nearly Harmed Parties',
  implicated_systems: 'Implicated Systems',
  editors: 'Editors',
  editor_notes: 'Editor Notes',
  reports: 'Reports',
};

export const getIncidentChanges = (oldVersion, newVersion, users, entities) => {
  const diffData = diff(oldVersion, newVersion);

  const result = [];

  for (const field of Object.keys(INCIDENT_TO_COMPARE)) {
    const fieldDiffs = diffData.filter((diff) => diff.key == field);

    if (fieldDiffs && fieldDiffs.length > 0) {
      for (const fieldDiff of fieldDiffs) {
        if (fieldDiff.embeddedKey && fieldDiff.changes) {
          const removed = [];

          const added = [];

          for (const change of fieldDiff.changes) {
            if (change.type == Operation.UPDATE) {
              removed.push(change.oldValue);
              added.push(change.value);
            } else if (change.type == Operation.ADD) {
              added.push(change.value);
            } else if (change.type == Operation.REMOVE) {
              removed.push(change.value);
            }
          }

          //Remove duplicates
          const removedClean = removed.filter((item) => !added.includes(item));

          const addedClean = added.filter((item) => !removed.includes(item));

          let removedLabels = removedClean;

          let addedLabels = addedClean;

          if (
            [
              'AllegedDeployerOfAISystem',
              'AllegedDeveloperOfAISystem',
              'AllegedHarmedOrNearlyHarmedParties',
              'implicated_systems',
            ].includes(field)
          ) {
            removedLabels = removedClean.map(
              (entityId) => entities?.find((e) => e.entity_id == entityId)?.name
            );
            addedLabels = addedClean.map(
              (entityId) => entities?.find((e) => e.entity_id == entityId)?.name
            );
          } else if (field == 'editors') {
            removedLabels = removedClean.map((userId) => {
              const user = users?.find((u) => u.userId == userId);

              return user ? `${user.first_name} ${user.last_name}` : userId;
            });
            addedLabels = addedClean.map((userId) => {
              const user = users?.find((u) => u.userId == userId);

              return user ? `${user.first_name} ${user.last_name}` : userId;
            });
          }

          if (removedLabels.length > 0 || addedLabels.length > 0) {
            result.push({
              field: INCIDENT_TO_COMPARE[field],
              type: 'list',
              removed: removedLabels,
              added: addedLabels,
            });
          }
        } else {
          if (fieldDiff.value != null && fieldDiff.value != undefined) {
            if (fieldDiff.type === Operation.UPDATE || fieldDiff.type === Operation.ADD) {
              result.push({
                field: INCIDENT_TO_COMPARE[field],
                type: 'text',
                oldValue: fieldDiff.oldValue,
                newValue: fieldDiff.value,
              });
            } else if (fieldDiff.type === Operation.REMOVE) {
              result.push({
                field: INCIDENT_TO_COMPARE[field],
                type: 'text',
                oldValue: fieldDiff.value,
                newValue: fieldDiff.oldValue,
              });
            }
          }
        }
      }
    }
  }

  return result;
};
