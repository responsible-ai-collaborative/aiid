import { wrapSchema } from '@graphql-tools/wrap';
import Cors from 'cors';
import siteConfig from '../../config';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../graphql/schema';

const cors = Cors();

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
    const remoteSchema = makeExecutableSchema({ typeDefs });

    const wrappedRemoteSchema = wrapSchema({
      schema: remoteSchema,
      executor: userExecutor,
    });

    graphqlMiddleware = createHandler({ schema: wrappedRemoteSchema, context: (req) => ({ req }) });
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
