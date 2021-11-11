module.exports = async ({ graphql }) => {
  const { data } = await graphql(`
    query AllIncidentsDataQuery {
      allMongodbAiidprodIncidents {
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
          incident_date
          epoch_date_downloaded
          epoch_date_modified
          epoch_date_published
          epoch_incident_date
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
          id
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

  let classificationsHash = {};

  data.allMongodbAiidprodClassifications.nodes.map((c) => {
    classificationsHash[c.incident_id] = getClassificationArray(c.classifications, c.namespace);
  });

  const downloadData = [];

  data.allMongodbAiidprodIncidents.nodes.map((i) => {
    const finalDataNode = {
      objectID: i['mongodb_id'],
      ...i,
    };

    if (classificationsHash[i.incident_id]) {
      finalDataNode.classifications = classificationsHash[i.incident_id];
    }

    downloadData.push(finalDataNode);
  });

  const truncatedData = downloadData.map(truncate);

  return truncatedData;
};
