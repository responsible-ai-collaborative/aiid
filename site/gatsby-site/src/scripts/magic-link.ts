/**
 * @fileoverview Development utility to generate magic login links without requiring MailerSend setup.
 * Useful for local testing and debugging authentication flows.
 * 
 * @example npm run magic-link -- --email user@example.com [--callbackUrl /path] [--roles role1,role2]
 * 
 * @note For development use only.
 */

import { generateMagicLink } from "../../playwright/utils";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

async function start() {
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: npm run magic-link --email <email> [--callbackUrl <url>] [--roles <roles>]")
    .option("email", {
      describe: "The email address to generate a magic link for",
      type: "string",
      demandOption: true,
    })
    .option("callbackUrl", {
      describe: "The URL to redirect to after authentication",
      type: "string",
      default: "/",
    })
    .option("roles", {
      describe: "Comma-separated list of roles to assign to the user",
      type: "string",
      default: "subscriber",
    })
    .example("npm run magic-link -- --email user@example.com", "Generate a magic link for user@example.com")
    .example("npm run magic-link -- --email user@example.com --callbackUrl /apps/incidents", "Generate a magic link with a custom callback URL")
    .example("npm run magic-link -- --email user@example.com --roles admin,editor", "Generate a magic link with custom roles")
    .help()
    .alias("h", "help")
    .parseSync();

  const { email, callbackUrl, roles } = argv;
  const rolesList = roles.split(",").map(role => role.trim());

  const magicLink = await generateMagicLink(email, callbackUrl, rolesList);

  console.log(`\nMagic link: ${magicLink}\n\n`);
}

if (require.main === module) {
  start();
}

