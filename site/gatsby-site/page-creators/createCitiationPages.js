const path = require('path');

const getClassificationsArray = (incidentClassifications, taxonomy) => {
  const classifications = incidentClassifications.filter(
    (c) => c.namespace === taxonomy.namespace
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
      });
    }
  });

  return array;
};

const createCitiationPages = async (graphql, createPage) => {
  const result = await graphql(
    `
      query IncidentIDs {
        allMongodbAiidprodIncidents {
          group(field: incident_id) {
            fieldValue
            edges {
              node {
                id
                submitters
                incident_date
                date_published
                incident_id
                report_number
                title
                url
                image_url
                cloudinary_id
                source_domain
                mongodb_id
                text
                authors
              }
            }
          }
        }

        allMongodbAiidprodClassifications(filter: { classifications: { Publish: { eq: true } } }) {
          nodes {
            incident_id
            id
            namespace
            notes
            classifications {
              Annotation_Status
              Annotator
              Ending_Date
              Beginning_Date
              Full_Description
              Intent
              Location
              Named_Entities
              Near_Miss
              Quality_Control
              Reviewer
              Severity
              Short_Description
              Technology_Purveyor
              AI_Applications
              AI_System_Description
              AI_Techniques
              Data_Inputs
              Financial_Cost
              Harm_Distribution_Basis
              Harm_Type
              Infrastructure_Sectors
              Laws_Implicated
              Level_of_Autonomy
              Lives_Lost
              Nature_of_End_User
              Physical_System
              Problem_Nature
              Public_Sector_Deployment
              Relevant_AI_functions
              Sector_of_Deployment
              System_Developer
              Publish
            }
          }
        }

        allMongodbAiidprodResources(filter: { classifications: { Publish: { eq: true } } }) {
          nodes {
            id
            incident_id
            notes
            classifications {
              Datasheets_for_Datasets
              Publish
            }
          }
        }

        allMongodbAiidprodTaxa {
          nodes {
            id
            namespace
            weight
            description
            field_list {
              public
              display_type
              long_name
              short_name
              long_description
              weight
              short_description
            }
          }
        }

        allMongodbAiidprodDuplicates {
          nodes {
            true_incident_number
            duplicate_incident_number
          }
        }
      }
    `
  );

  const {
    allMongodbAiidprodIncidents,
    allMongodbAiidprodClassifications,
    allMongodbAiidprodDuplicates,
    allMongodbAiidprodTaxa,
    allMongodbAiidprodResources,
  } = result.data;

  // Incident reports list
  const incidentReportsMap = {};

  allMongodbAiidprodIncidents.group.map((g) => {
    incidentReportsMap[g.fieldValue] = g.edges;
  });

  const allClassifications = [
    ...allMongodbAiidprodClassifications.nodes.map((r) => ({ ...r, namespace: 'CSET' })),
    ...allMongodbAiidprodResources.nodes.map((r) => ({ ...r, namespace: 'resources' })),
  ];

  for (const incident_id of Object.keys(incidentReportsMap)) {
    const incidentClassifications = allClassifications.filter(
      (t) => t.incident_id.toString() === incident_id
    );

    const taxonomies = [];

    allMongodbAiidprodTaxa.nodes.forEach((t) => {
      const notes = incidentClassifications.find((c) => c.namespace === t.namespace)?.notes;

      taxonomies.push({
        notes,
        namespace: t.namespace,
        classificationsArray: getClassificationsArray(incidentClassifications, t),
        taxonomyFields: t.field_list,
      });
    });

    // Create citation pages
    createPage({
      path: '/cite/' + incident_id,
      component: path.resolve('./src/templates/cite.js'),
      context: {
        incidentReports: incidentReportsMap[incident_id],
        taxonomies,
      },
    });
  }

  for (const {
    true_incident_number,
    duplicate_incident_number,
  } of allMongodbAiidprodDuplicates.nodes) {
    createPage({
      path: '/cite/' + duplicate_incident_number,
      component: path.resolve('./src/templates/cite-duplicate.js'),
      context: {
        duplicate_incident_number: parseInt(duplicate_incident_number),
        true_incident_number: parseInt(true_incident_number),
      },
    });
  }
};

module.exports = createCitiationPages;
