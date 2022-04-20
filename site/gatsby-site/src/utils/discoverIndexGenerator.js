const { getUnixTime } = require('date-fns');

module.exports = async ({ graphql }) => {
  const { data } = await graphql(`
    query AllIncidentsDataQuery {
      allMongodbAiidprodIncidents {
        nodes {
          date
          incident_id
          reports
        }
      }

      allMongodbAiidprodReports {
        nodes {
          mongodb_id
          description
          authors
          image_url
          cloudinary_id
          language
          source_domain
          text
          title
          url
          date_downloaded
          date_modified
          date_published
          date_submitted
          epoch_date_downloaded
          epoch_date_modified
          epoch_date_published
          epoch_date_submitted
          submitters
          date_submitted
          report_number
          incident_id
          ref_number
        }
      }

      allMongodbAiidprodClassifications(
        filter: { namespace: { eq: "CSET" }, classifications: { Publish: { eq: true } } }
      ) {
        nodes {
          incident_id
          namespace
          classifications {
            Harm_Distribution_Basis
            Intent
            Lives_Lost
            Location
            Named_Entities
            Near_Miss
            Severity
            AI_Applications
            AI_Techniques
            Financial_Cost
            Harm_Type
            Infrastructure_Sectors
            Level_of_Autonomy
            Lives_Lost
            Nature_of_End_User
            Physical_System
            Problem_Nature
            Public_Sector_Deployment
            Relevant_AI_functions
            Sector_of_Deployment
            System_Developer
            Technology_Purveyor
          }
        }
      }

      allMongodbAiidprodResources(filter: { classifications: { Publish: { eq: true } } }) {
        nodes {
          incident_id
          classifications {
            Datasheets_for_Datasets
            MSFT_AI_Fairness_Checklist
          }
        }
      }
    }
  `);

  const truncate = (doc) => {
    for (const [key, value] of Object.entries(doc)) {
      if (typeof value == 'string') {
        if (value.length > 8000) {
          doc[key] = value.substring(0, 8000);
        }
      }
    }
    return doc;
  };

  const getClassificationArray = (cObj, namespace) => {
    const cArray = [];

    for (const c in cObj) {
      if (cObj[c] !== null) {
        let valuesToUnpack = null;

        if (typeof cObj[c] === 'object') {
          valuesToUnpack = cObj[c];
        } else {
          valuesToUnpack = [cObj[c]];
        }
        if (cObj[c] !== undefined && cObj[c] !== '' && valuesToUnpack.length > 0) {
          valuesToUnpack.forEach((element) =>
            cArray.push(`${namespace}:${c.replace(/_/g, ' ')}:${element}`)
          );
        }
      }
    }

    return cArray;
  };

  const { allMongodbAiidprodClassifications, allMongodbAiidprodResources } = data;

  const allClassifications = {
    CSET: allMongodbAiidprodClassifications.nodes,
    resources: allMongodbAiidprodResources.nodes,
  };

  const downloadData = [];

  for (const incident of data.allMongodbAiidprodIncidents.nodes) {
    for (const reportNumber of incident.reports) {
      const report = data.allMongodbAiidprodReports.nodes.find(
        (r) => r.report_number === reportNumber
      );

      let classifications = [];

      for (const namespace in allClassifications) {
        const classification = allClassifications[namespace].find(
          (c) => c.incident_id === incident.incident_id
        )?.classifications;

        if (classification) {
          const keys = getClassificationArray(classification, namespace);

          classifications = [...classifications, ...keys];
        }
      }

      const reportData = {
        ...report,
        objectID: report.mongodb_id,
        epoch_incident_date: getUnixTime(new Date(incident.date)),
        incident_date: incident.date,
        classifications,
      };

      downloadData.push(truncate(reportData));
    }
  }

  return downloadData;
};
