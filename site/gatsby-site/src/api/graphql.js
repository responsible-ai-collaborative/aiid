import { wrapSchema } from '@graphql-tools/wrap';
import Cors from 'cors';
import siteConfig from '../../config';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../graphql/schema';

// function is crashing locally with `PayloadTooLargeError: request entity too large` error

export const config = {
  bodyParser: {
    raw: {
      type: `-`,
    },
    text: {
      type: `-`,
    },
    urlencoded: {
      type: `-`,
      extended: true,
    },
    json: {
      type: `*/*`,
      limit: `10mb`,
    },
  },
};
const cors = Cors();

const remoteExecutor = buildHTTPExecutor({
  endpoint: `https://realm.mongodb.com/api/client/v2.0/app/${siteConfig.realm.production_db.realm_app_id}/graphql`,
  headers(executorRequest) {
    // we allow read operations to be executed without an authorization header

    if (
      !executorRequest?.context.req.headers.authorization &&
      executorRequest?.info.operation.operation == 'query'
    ) {
      return {
        apiKey: siteConfig.realm.graphqlApiKey,
      };
    }

    // if a header is present do a 1 to 1 pass through

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
      executor: remoteExecutor,
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
