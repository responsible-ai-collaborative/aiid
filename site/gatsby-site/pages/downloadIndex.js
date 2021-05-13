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
    if (data) {
      const truncatedData = data.allMongodbAiidprodIncidents.nodes.map(truncate);

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
