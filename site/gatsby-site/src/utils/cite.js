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

    return translation ? { ...r, text: translation.text, title: translation.title } : { ...r };
  });
};
