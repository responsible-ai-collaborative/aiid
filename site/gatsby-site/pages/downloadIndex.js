import { useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const ALL_INCIDENTS_DATA = graphql`
  query AllIncidentsDataQuery {
    allMongodbAiidprodIncidents {
      nodes {
        mongodb_id
        description
        authors
        image_url
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
    allMongodbAiidprodClassifications(filter: { namespace: { eq: "CSET" } }) {
      nodes {
        incident_id
        id
        namespace
        classifications {
          Harm_distribution_basis
          Intent
          Lives_lost
          Location
          Named_entities
          Near_miss
          Severity
          Technology_purveyor
          AI_Applications
          AI_techniques
          Finacial_Cost
          Harm_Distribution_Basis
          Harm_Type
          Infrastructure_Sectors
          Level_of_Autonomy
          Lives_Lost
          Named_Entities
          Nature_of_End_User
          Near_Miss
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
`;

const DownloadIndex = () => {
  const data = useStaticQuery(ALL_INCIDENTS_DATA);

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

  useEffect(() => {
    const getStringForValue = (value) => {
      switch (typeof value) {
        case 'object':
          return value.join(', ');

        case 'boolean':
          return value ? 'Yes' : 'No';

        default:
          return value;
      }
    };

    const getClassificationArray = (cObj, namespace) => {
      const cArray = [];

      for (const c in cObj) {
        if (cObj[c] !== null) {
          const value = getStringForValue(cObj[c]);

          if (value !== undefined && value !== '' && value.length > 0) {
            cArray.push(`${namespace}:${c}:${cObj[c]}`);
          }
        }
      }

      return cArray;
    };

    if (data) {
      let classificationsHash = {};

      data.allMongodbAiidprodClassifications.nodes.map((c) => {
        classificationsHash[c.incident_id] = getClassificationArray(c.classifications, c.namespace);
      });

      const downloadData = [];

      data.allMongodbAiidprodIncidents.nodes.map((i) => {
        let finalDataNode = {
          ...i,
        };

        if (classificationsHash[i.incident_id]) {
          finalDataNode = {
            ...i,
            classifications: classificationsHash[i.incident_id],
          };
        }

        downloadData.push(finalDataNode);
      });

      const truncatedData = downloadData.map(truncate);

      var a = document.createElement('a');

      var file = new Blob([JSON.stringify(truncatedData)], { type: 'text/plain' });

      a.href = URL.createObjectURL(file);
      a.download = 'new_index.json';
      a.click();
    }
  }, [data]);

  return null;
};

export default DownloadIndex;
