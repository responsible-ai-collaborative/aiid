import { introspectSchema, wrapSchema, FilterRootFields } from '@graphql-tools/wrap';
import { mergeSchemas } from '@graphql-tools/schema';
import fetch from 'cross-fetch';
import { print } from 'graphql';
import Cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import config from '../../config';

const cors = Cors();

// This custom executor is used to execute GraphQL queries against the Realm API
// https://www.graphql-tools.com/docs/schema-wrapping#schema-wrapping

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

// Cache the Graphql middleware to make use of Lambdas's Container reuse

let graphqlMiddleware = null;

export default async function handler(req, res) {
  if (!graphqlMiddleware) {
    // We want to expose a read-only api so Mutation operations are filtered out

    const realmSubschema = wrapSchema({
      schema: await introspectSchema(realmExecutor),
      executor: realmExecutor,
      transforms: [new FilterRootFields((operationName) => operationName != 'Mutation')],
    });

    // Root types (Mutation in this case) can't be empty so we add a dummy type to the definition
    // https://github.com/graphql/graphql-spec/issues/568

    const gatewaySchema = mergeSchemas({
      schemas: [realmSubschema],
      typeDefs: `
        type Mutation {
          _: Boolean
        }
      `,
      resolvers: {
        Mutation: {
          _: () => true,
        },
      },
    });

    graphqlMiddleware = graphqlHTTP({ schema: gatewaySchema, graphiql: true });
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
