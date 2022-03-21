import { introspectSchema } from '@graphql-tools/wrap';
import fetch from 'cross-fetch';
import { print } from 'graphql';
import { stitchSchemas } from '@graphql-tools/stitch';
import Cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import config from '../../config';

const cors = Cors();

async function realmExecutor({ document, variables }) {
  const query = print(document);

  const fetchResult = await fetch(
    `https://realm.mongodb.com/api/client/v2.0/app/${config.realm.production_db.realm_app_id}/graphql`,
    {
      method: 'POST',
      headers: {
        apiKey: config.realm.graphqlApiKey,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  return fetchResult.json();
}

let graphqlMiddleware = null;

export default async function handler(req, res) {
  if (!graphqlMiddleware) {
    const realmSubschema = {
      schema: await introspectSchema(realmExecutor),
      executor: realmExecutor,
    };

    const gatewaySchema = stitchSchemas({
      subschemas: [realmSubschema],
    });

    graphqlMiddleware = graphqlHTTP({ schema: gatewaySchema, graphiql: true });
  }

  await new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
      }
      resolve(result);
    });
  });

  return new Promise((resolve, reject) => {
    graphqlMiddleware(req, res, (result) => {
      console.log(req);
      if (result instanceof Error) {
        reject(result);
      }
      resolve(result);
    });
  });
}
