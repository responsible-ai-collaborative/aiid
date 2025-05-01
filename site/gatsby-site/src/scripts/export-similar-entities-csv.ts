/**
 * A script for exporting similar entities to a CSV via GraphQL API.
 *
 * Usage: npm run export-similar-entities-csv -- [--graphqlEndpoint=https://incidentdatabase.ai/api/graphql] [--threshold=80] [--output=similar_entities.csv]
 */

import 'dotenv/config';
import fs from 'fs';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import fetch from 'cross-fetch';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import ora from 'ora';
import chalk from 'chalk';
import { findSimilarEntities, SimilarEntityPair } from '../../server/shared/entities';
import OpenAI from 'openai';

interface Args {
  graphqlEndpoint: string;
  threshold: number;
  output: string;
  useLLM: boolean;
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
    .option('useLLM', { type: 'boolean', default: false, description: 'Use LLM to check merge opportunities' })
    .help().alias('help', 'h').parseSync() as Args;
}

// Helper to call the LLM for each entity pair
async function checkPairsWithLLM(openai: OpenAI, pairs: SimilarEntityPair[]): Promise<string[]> {
  const systemPrompt = `You are an entity merge assistant. Follow these rules:
  - Do NOT merge version/number differences (e.g., chat gp3 vs chat gp3 4).
  - Do NOT merge singular vs plural.
  - Do NOT merge general vs specific (e.g., citizens vs citizens of New York).
  - Only merge minor typos or word-order changes if identical in meaning.
  When deciding, respond with a JSON object with a single key \"mergeInto\":
    \"1\" to merge entity 2 into entity 1,
    \"2\" to merge entity 1 into entity 2,
    \"\" to keep both or ignore.
  Example: {\"mergeInto\":\"1\"}
  No additional text or keys.
  `;
  const decisions: string[] = [];
  for (const pair of pairs) {
    console.log(chalk.blue(`LLM check for pair: "${pair.entityName1}" (ID ${pair.entityId1}) vs "${pair.entityName2}" (ID ${pair.entityId2})`));
    const userPrompt = `Entities: "${pair.entityName1}" (ID ${pair.entityId1}) and "${pair.entityName2}" (ID ${pair.entityId2}). Decide if they represent the same entity.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      response_format: { type: 'json_object' },
    });
    const raw = response.choices?.[0]?.message?.content?.trim() ?? '';
    let mergeInto = '';
    try {
      const parsed = JSON.parse(raw);
      if (parsed.mergeInto === '1' || parsed.mergeInto === '2') mergeInto = parsed.mergeInto;
    } catch {
      // ignore JSON errors
    }
    decisions.push(mergeInto);
  }
  return decisions;
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
  console.log(chalk.yellow('Use LLM check:'), args.useLLM);
  const spinner = ora('Processing entities').start();
  const client = createApolloClient(args.graphqlEndpoint);

  const { data } = await client.query({ query: GET_ENTITIES_QUERY });
  const entities: any[] = data.entities;
  spinner.text = `Fetched ${entities.length} entities, computing similar pairs...`;
  spinner.render();

  const similarPairs: SimilarEntityPair[] = findSimilarEntities(entities, args.threshold);
  spinner.succeed(`Found ${similarPairs.length} similar pairs`);

  // Start CSV with data columns, without human decision
  let header = 'Entity ID 1,Entity Name 1,Entity ID 2,Entity Name 2,Similarity';
  let rows = similarPairs.map(p => {
    const name1 = `"${p.entityName1.replace(/"/g, '""')}"`;
    const name2 = `"${p.entityName2.replace(/"/g, '""')}"`;
    return `${p.entityId1},${name1},${p.entityId2},${name2},${p.similarity.toFixed(2)}`;
  });
  // Append human decision only if LLM is disabled
  if (!args.useLLM) {
    header += ',Keep (1 or 2)';
    rows = rows.map(row => `${row},`);
  }
  // Optional LLM check
  if (args.useLLM) {
    if (!process.env.OPENAI_API_KEY) {
      console.error(chalk.red('OPENAI_API_KEY not set')); process.exit(1);
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    spinner.start('Checking similar pairs with LLM');
    const decisions = await checkPairsWithLLM(openai, similarPairs);
    spinner.succeed('LLM checking complete');
    // Insert LLM decision before human decision
    header += ',LLM decision,Keep (1 or 2)';
    rows = rows.map((row, i) => `${row},${decisions[i]},`);
  }
  const csv = [header, ...rows].join('\n');
  fs.writeFileSync(args.output, csv);
  console.log(chalk.green(`CSV written to ${args.output}`));
}

if (require.main === module) {
  main();
}

export { main, parseArgs, createApolloClient };