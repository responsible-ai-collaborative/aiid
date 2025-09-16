/**
 * A script for converting AIID matches export to OECD incident relationships JSON.
 * This script generates the file data/oecd_relationships.json.
 * 
 * Usage: npm run generate-oecd-relationships -- --inputFile=PATH_TO_JSON_FILE --outputFile=PATH_TO_OUTPUT_JSON
 * 
 * This script will:
 * 1. Parse the AIID matches export JSON file
 * 2. Convert to the relationship format
 * 3. Write the relationships to an output JSON file which can be used in a migration
 */

import fs from 'fs';
import path from 'path';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import ora from 'ora';
import chalk from 'chalk';

interface CommandLineArgs {
  inputFile: string;
  outputFile: string;
}

interface AiidMatchEntry {
  report?: {
    aiid_incident_ids?: number[];
  };
  incident?: {
    id?: string;
    event_type?: string;
  };
  is_related: boolean;
}

interface IncidentRelationship {
  incident_id: number;
  sameAs: string;
  source_namespace: string;
}

function parseArgs(): CommandLineArgs {
  return yargs(hideBin(process.argv))
    .option('inputFile', {
      description: 'Path to the JSON file containing AIID matches export',
      type: 'string',
      demandOption: true
    })
    .option('outputFile', {
      description: 'Path where to save the output JSON file',
      type: 'string',
      demandOption: true
    })
    .parseSync();
}

function processMatchesJson(data: AiidMatchEntry[]): IncidentRelationship[] {
  const relationships: IncidentRelationship[] = [];

  for (const entry of data) {

    if (!entry.incident?.id || !entry.is_related) {
      continue;
    }
    

    const incidentIds = entry.report?.aiid_incident_ids || [];
    
    for (const incidentId of incidentIds) {
      relationships.push({
        incident_id: incidentId,
        sameAs: `https://oecd.ai/en/incidents/${entry.incident.id}`,
        source_namespace: 'OECD'
      });
    }
  }

  const uniqueRelationships: IncidentRelationship[] = [];
  const seen = new Set<string>();
  for (const rel of relationships) {
    const key = `${rel.incident_id}|${rel.sameAs}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRelationships.push(rel);
    }
  }
  return uniqueRelationships;
}

async function writeRelationshipsToFile(relationships: IncidentRelationship[], outputFilePath: string): Promise<void> {
  if (relationships.length === 0) {
    console.log(chalk.yellow('No relationships found to write'));
    return;
  }

  const spinner = ora(`Writing ${relationships.length} relationships to ${outputFilePath}...`).start();

  try {

    const directory = path.dirname(outputFilePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(relationships, null, 2));
    
    spinner.succeed(chalk.green(`Successfully wrote relationships to ${outputFilePath}`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to write relationships to ${outputFilePath}`));
    throw error;
  }
}

async function main(): Promise<void> {
  const args = parseArgs();
  
  try {

    if (!fs.existsSync(args.inputFile)) {
      throw new Error(`Input file not found: ${args.inputFile}`);
    }
    
    console.log(chalk.blue(`Reading input file: ${args.inputFile}`));
    const jsonData = fs.readFileSync(args.inputFile, 'utf-8');
    const matchesData: AiidMatchEntry[] = JSON.parse(jsonData);

    console.log(chalk.blue(`Processing ${matchesData.length} entries from the JSON file...`));
    const relationships = processMatchesJson(matchesData);

    console.log(chalk.blue(`Generated ${relationships.length} relationships`));
    
    await writeRelationshipsToFile(relationships, args.outputFile);
    
    console.log(chalk.green('Script completed successfully!'));
  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('Error in main function:'), error);
    process.exit(1);
  });
}
