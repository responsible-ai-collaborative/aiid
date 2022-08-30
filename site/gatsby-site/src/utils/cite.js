export const getClassificationsArray = (incidentClassifications, taxonomy) => {
  const classifications = incidentClassifications.filter(
    (c) => c?.namespace === taxonomy.namespace
  )[0];

  if (!classifications) {
    return [];
  }
  const classificationObj = classifications.classifications;

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
    const c = classificationObj[field.short_name.split(' ').join('_')];

    const value = getStringForValue(c);

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

export const getTaxonomies = ({
  mongodbAiidprodClassifications,
  mongodbAiidprodResources,
  allMongodbAiidprodTaxa,
}) => {
  if (mongodbAiidprodClassifications) {
    mongodbAiidprodClassifications.namespace = 'CSET';
  }

  if (mongodbAiidprodResources) {
    mongodbAiidprodResources.namespace = 'resources';
  }

  const incidentClassifications = [mongodbAiidprodClassifications, mongodbAiidprodResources];

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
