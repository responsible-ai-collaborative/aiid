exports = async (input) => {

  const incidentsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");
  const reportsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");
  
  const results = []

  for (const url of input.urls) {
    
    const result = {url, reports: [], incidents: []};
    
    const parsedURL = new URL(url);
    
    console.log('looking for', url);

    const reportDocs = await reportsCollection.find({url: {
      $regex: parsedURL.host + parsedURL.pathname,
      $options: 'i',
    }}).toArray();
    
    console.log('reports found', reportDocs.length);

    for(const doc of reportDocs) {
      
      result.reports.push({ 
        report_number: doc.report_number, 
        title: doc.title, 
        url: doc.url 
      });
      
      const incidentDocs = await incidentsCollection.find({reports: doc.report_number}).toArray();
      
      console.log('incidents found', incidentDocs.length);

      for(const incidentDoc of incidentDocs) {
        
        result.incidents.push({
          incident_id: incidentDoc.incident_id,
          title: incidentDoc.title,
          permalink: `https://incidentdatabase.ai/cite/${incidentDoc.incident_id}`,
        });
      }
    }
    
    results.push(result);
  }


  return { results };
};
