import Cors from 'cors';
import { schema } from '../../server/schema';
import { context } from '../../server/context';
import { Handler } from 'express';
import { createHandler } from "graphql-http/lib/use/express";
import * as reporter from '../../server/reporter';
import { MongoClient } from 'mongodb';
import appConfig from '../../server/config';

const cors = Cors();

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

// Cache the Graphql middleware to make use of Lambdas's Container reuse

let graphqlMiddleware: Handler | null = null;

let client: MongoClient | null = null;


export default async function handler(req: any, res: any) {

  if (!client) {
    client = new MongoClient(appConfig.API_MONGODB_CONNECTION_STRING, {});

    await client.connect();
  }

  if (!graphqlMiddleware) {

    graphqlMiddleware = createHandler({
      schema: schema,
      context: (req: any) => context({ req, client: client! }),
      onOperation: async () => {
        // gatsby functions do not keep module variables across invocations, and it seems netlify functions don't either (unlike when hosting directly on AWS Lambda)
        // so we have to create and close a new client for each invocation
        await client?.close();
        client = null;
      },

      formatError: (error) => {
        reporter.error(error);
        return error;
      }
    });
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


  return graphqlMiddleware!(req, res);
}
