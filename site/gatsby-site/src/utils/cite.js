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

  const getStringForValue = (value) => {
    if (value === null) {
      return '';
    }

    switch (typeof value) {
      case 'object':
        return value.join(', ');

      case 'boolean':
        return value ? 'Yes' : 'No';

      default:
        return value;
    }
  };

  taxaFieldsArray.forEach((field) => {
    const attribute = attributes && attributes.find((a) => a.short_name == field.short_name);

    const attributeValue = attribute?.value_json && JSON.parse(attribute.value_json);

    const value = getStringForValue(attributeValue);

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

    taxonomies.push({
      notes,
      namespace: t.namespace,
      classificationsArray: getClassificationsArray(incidentClassifications, t),
      taxonomyFields: t.field_list,
    });
  });

  return taxonomies;
};

export const getTranslatedReports = ({ allMongodbAiidprodReports, translations, locale }) => {
  return allMongodbAiidprodReports.nodes.map((r) => {
    const translation = translations[locale]?.nodes.find(
      (t) => t.report_number === r.report_number
    );

    return translation ? { ...r, text: translation.text, title: translation.title } : { ...r };
  });
};
