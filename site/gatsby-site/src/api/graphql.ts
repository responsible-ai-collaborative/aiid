import Cors from 'cors';
import { createHandler } from 'graphql-http/lib/use/express';
import { getSchema } from '../../server/server';
import { context } from '../../server/context';
import { Handler } from 'express';

const cors = Cors();


// Cache the Graphql middleware to make use of Lambdas's Container reuse

let graphqlMiddleware: Handler | null = null;

export default async function handler(req: any, res: any) {
  if (!graphqlMiddleware) {

    const schema = await getSchema();

    graphqlMiddleware = createHandler({ schema, context: (req) => context({ req: req as any }) });
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
