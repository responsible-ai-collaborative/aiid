import Cors from 'cors';
import { getSchema } from '../../server/server';
import { context } from '../../server/context';
import { Handler } from 'express';
const { createHandler } = require("graphql-http/lib/use/express") // CommonJS

const cors = Cors();

// Cache the Graphql middleware to make use of Lambdas's Container reuse

let graphqlMiddleware: Handler | null = null;

export default async function handler(req: any, res: any) {
  if (!graphqlMiddleware) {

    const schema = await getSchema();

    graphqlMiddleware = createHandler({ schema: schema, context: (req: any) => context({ req }) });
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
