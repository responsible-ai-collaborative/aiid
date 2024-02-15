import fetch from 'cross-fetch';
import Cors from 'cors';
import siteConfig from '../../config';

const cors = Cors();

const query = `
query Lookup($urls: [String]){
  lookupByUrl(input:{urls: $urls}){
    results {
      url
    }
  }
}`;

export default async function handler(req, res) {
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

  const data = await response.json();

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
