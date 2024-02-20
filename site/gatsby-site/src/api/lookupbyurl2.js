import Cors from 'cors';
import { LRUCache } from 'lru-cache';
import { MongoClient } from 'mongodb';
import config from '../../config';

const cors = Cors();

// netlify-lambda has a max memory of 1024MB
// average size of the response is 1KB per URL

const cache = new LRUCache({ max: 1000000 });

export default async function handler(req, res) {
  let data = null;

  if (cache.has(req.query.urls) && req.query.urls.length > 0) {
    data = cache.get(req.query.urls);
  } else {
    const urls = req.query.urls.split(',');

    const client = new MongoClient(config.mongodb.translationsConnectionString);

    const incidentsCollection = client.db('aiidprod').collection('incidents');

    const reportsCollection = client.db('aiidprod').collection('reports');

    const results = [];

    for (const url of urls) {
      const result = { url, reports: [], incidents: [] };

      const parsedURL = new URL(url);

      const reportDocs = await reportsCollection
        .find({
          url: {
            $regex: parsedURL.host + parsedURL.pathname,
            $options: 'i',
          },
        })
        .toArray();

      for (const doc of reportDocs) {
        result.reports.push({
          report_number: doc.report_number,
          title: doc.title,
          url: doc.url,
        });

        const incidentDocs = await incidentsCollection
          .find({ reports: doc.report_number })
          .toArray();

        for (const incidentDoc of incidentDocs) {
          result.incidents.push({
            incident_id: incidentDoc.incident_id,
            title: incidentDoc.title,
            permalink: `https://incidentdatabase.ai/cite/${incidentDoc.incident_id}`,
          });
        }
      }

      results.push(result);
    }

    cache.set(req.query.urls, { results });
    data = results;

    // Manually run the cors middleware
    // https://www.gatsbyjs.com/docs/reference/functions/middleware-and-helpers/#custom-middleware

    await new Promise((resolve, reject) => {
      cors(req, res, (result) => {
        if (result instanceof Error) {
          reject(result);
        }
        resolve(result);
      });
    });

    res.status(200).json(data);
  }
}
