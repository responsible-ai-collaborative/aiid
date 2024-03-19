import { wrapSchema, schemaFromExecutor } from '@graphql-tools/wrap';
import Cors from 'cors';
import siteConfig from '../../config';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';

const cors = Cors();

const introspectionExecutor = buildHTTPExecutor({
  endpoint: `https://realm.mongodb.com/api/client/v2.0/app/${siteConfig.realm.production_db.realm_app_id}/graphql`,
  headers: {
    apiKey: siteConfig.realm.graphqlApiKey,
  },
});

const userExecutor = buildHTTPExecutor({
  endpoint: `https://realm.mongodb.com/api/client/v2.0/app/${siteConfig.realm.production_db.realm_app_id}/graphql`,
  headers(executorRequest) {
    return {
      authorization: executorRequest?.context.req.headers.authorization,
    };
  },
});

// Cache the Graphql middleware to make use of Lambdas's Container reuse

let graphqlMiddleware = null;

export default async function handler(req, res) {
  if (!graphqlMiddleware) {
    const schema = wrapSchema({
      schema: await schemaFromExecutor(introspectionExecutor),
      executor: userExecutor,
    });

    graphqlMiddleware = createHandler({ schema, context: (req) => ({ req }) });
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

  return graphqlMiddleware(req, res);
}
