/**
 * A script for exporting similar entities to a CSV via GraphQL API.
 *
 * Usage: npm run export-similar-entities-csv -- [--graphqlEndpoint=https://incidentdatabase.ai/api/graphql] [--threshold=80] [--output=similar_entities.csv]
 */

import fs from 'fs';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import fetch from 'cross-fetch';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import ora from 'ora';
import chalk from 'chalk';
import { findSimilarEntities, SimilarEntityPair } from '../../server/shared/entities';

interface Args {
  graphqlEndpoint: string;
  threshold: number;
  output: string;
}

function createApolloClient(endpoint: string): ApolloClient<any> {
  return new ApolloClient({
    link: new HttpLink({
      uri: endpoint,
      fetch,
    }),
    cache: new InMemoryCache({ addTypename: false }),
  });
}

function parseArgs(): Args {
  return yargs(hideBin(process.argv))
    .strict()
    .option('graphqlEndpoint', { type: 'string', default: 'https://incidentdatabase.ai/api/graphql', description: 'GraphQL API endpoint' })
    .option('threshold', { type: 'number', default: 80, description: 'Similarity threshold as percentage (0-100)' })
    .option('output', { type: 'string', default: 'similar_entities.csv', description: 'Output CSV file path' })
    .help().alias('help', 'h').parseSync() as Args;
}

// GraphQL query to fetch all entities
const GET_ENTITIES_QUERY = gql`
  query GetAllEntities {
    entities {
      entity_id
      name
    }
  }
`;

async function main(): Promise<void> {
  const args = parseArgs();
  console.log(chalk.blue('Export Similar Entities CSV'));
  console.log(chalk.yellow('GraphQL endpoint:'), args.graphqlEndpoint);
  console.log(chalk.yellow('Threshold:'), `${args.threshold}%`);
  const spinner = ora('Processing entities').start();
  const client = createApolloClient(args.graphqlEndpoint);

  const { data } = await client.query({ query: GET_ENTITIES_QUERY });
  const entities: any[] = data.entities;
  spinner.text = `Fetched ${entities.length} entities, computing similar pairs...`;
  spinner.render();

  const similarPairs: SimilarEntityPair[] = findSimilarEntities(entities, args.threshold);
  spinner.succeed(`Found ${similarPairs.length} similar pairs`);

  const header = 'Entity ID 1,Entity Name 1,Entity ID 2,Entity Name 2,Similarity,Keep (1 or 2)';
  const rows = similarPairs.map(p => {
    const name1 = `"${p.entityName1.replace(/"/g, '""')}"`;
    const name2 = `"${p.entityName2.replace(/"/g, '""')}"`;
    return `${p.entityId1},${name1},${p.entityId2},${name2},${p.similarity.toFixed(2)},`;
  });
  const csv = [header, ...rows].join('\n');
  fs.writeFileSync(args.output, csv);
  console.log(chalk.green(`CSV written to ${args.output}`));
}

if (require.main === module) {
  main();
}

export { main, parseArgs, createApolloClient };