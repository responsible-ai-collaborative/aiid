const path = require('path');

const TSNE = require('tsne-js');

const createTsneVisualizationPage = async (graphql, createPage) => {
  const result = await graphql(
    `
      query IncidentIDs {
        allMongodbAiidprodIncidents {
          nodes {
            incident_id
            date
            reports
            editors
            embedding {
              vector
            }
            editor_similar_incidents
            editor_dissimilar_incidents
            flagged_dissimilar_incidents
            nlp_similar_incidents {
              incident_id
              similarity
            }
          }
        }

        allMongodbAiidprodReports {
          nodes {
            submitters
            date_published
            report_number
            title
            url
            image_url
            cloudinary_id
            source_domain
            mongodb_id
            text
            authors
            epoch_date_submitted
            language
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
              render_as
            }
          }
        }
      }
    `
  );

  const {
    allMongodbAiidprodIncidents,
    allMongodbAiidprodReports,
    allMongodbAiidprodClassifications,
    allMongodbAiidprodResources,
  } = result.data;

  // Incident reports list
  const incidentReportsMap = {};

  for (const incident of allMongodbAiidprodIncidents.nodes) {
    incidentReportsMap[incident.incident_id] = incident.reports
      .map((r) => allMongodbAiidprodReports.nodes.find((n) => n.report_number === r))
      .map((r) => ({ ...r }));
  }

  const allClassifications = [
    ...allMongodbAiidprodClassifications.nodes.map((r) => ({ ...r, namespace: 'CSET' })),
    ...allMongodbAiidprodResources.nodes.map((r) => ({ ...r, namespace: 'resources' })),
  ];

  let spatialIncidents;

  const incidentsWithEmbeddings = allMongodbAiidprodIncidents.nodes.filter(
    (incident) => incident.embedding
  );

  const embeddings = incidentsWithEmbeddings.map((incident) => incident?.embedding?.vector);

  const ids = incidentsWithEmbeddings.map((incident) => incident.incident_id);

  const model = new TSNE({
    dim: 2,
    perplexity: 30.0,
    earlyExaggeration: 3.0,
    learningRate: 100.0,
    nIter: 10000,
    metric: 'euclidean',
  });

  // inputData is a nested array which can be converted into an ndarray
  // alternatively, it can be an array of coordinates (second argument should be specified as 'sparse')
  model.init({
    data: embeddings,
    type: 'dense',
  });

  // `error`,  `iter`: final error and iteration number
  // note: computation-heavy action happens here
  const [err, iter] = model.run();

  if (err) {
    console.error(err, iter);
  }

  // `outputScaled` is `output` scaled to a range of [-1, 1]
  const outputScaled = model.getOutputScaled();

  spatialIncidents = outputScaled.map((array, i) => {
    const spatialIncident = {
      incident_id: ids[i],
      x: array[0],
      y: array[1],
      classifications: ((c) => {
        if (!c) return null;
        let classificationsSubset = {};

        for (let axis of [
          'Harm_Distribution_Basis',
          'System_Developer',
          'Problem_Nature',
          'Sector_of_Deployment',
          'Harm_Type',
          'Intent',
          'Near_Miss',
          'Severity',
        ]) {
          classificationsSubset[c.namespace + ':' + axis] = c.classifications[axis];
        }
        return classificationsSubset;
      })(allClassifications.find((c) => c.incident_id == ids[i])),
    };

    return spatialIncident;
  });

  createPage({
    path: 'summaries/spatial',
    component: path.resolve('./src/templates/tsneVisualizationPage.js'),
    context: {
      spatialIncidents,
    },
  });
};

module.exports = createTsneVisualizationPage;
