import fetch from 'cross-fetch';
import Cors from 'cors';
import siteConfig from '../../config';
import { LRUCache } from 'lru-cache';

const cors = Cors();

const query = `
query Lookup($urls: [String]){
  lookupByUrl(input:{urls: $urls}){
    results {
      url
      incidents {
        incident_id
        title
        permalink
      }
      reports {
        report_number
        url
        title
      }
    }
  }
}`;

// netlify-lambda has a max memory of 1024MB
// average size of the response is 1KB per URL

const cache = new LRUCache({ max: 1000000 });

export default async function handler(req, res) {
  let data = null;

  if (cache.has(req.query.urls) && req.query.urls.length > 0) {
    data = cache.get(req.query.urls);
  } else {
    const variables = { urls: req.query.urls.split(',') };

    const response = await fetch(
      `https://realm.mongodb.com/api/client/v2.0/app/${siteConfig.realm.production_db.realm_app_id}/graphql`,
      {
        method: 'POST',
        headers: {
          apiKey: siteConfig.realm.graphqlApiKey,
        },
        body: JSON.stringify({ query, variables }),
      }
    );

    data = await response.json();
  }

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
