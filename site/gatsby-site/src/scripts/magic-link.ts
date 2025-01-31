/**
 * @fileoverview Development utility to generate magic login links without requiring MailerSend setup.
 * Useful for local testing and debugging authentication flows.
 * 
 * @example npm run magic-link user@example.com [callbackUrl]
 * 
 * @note For development use only.
 */

import { generateMagicLink } from "../../playwright/utils";

function displayHelp(): void {
  console.log(`
  Usage: npm run magic-link <email> [callbackUrl]
  
  Arguments:
    email       Required. The email address to generate a magic link for
    callbackUrl Optional. The URL to redirect to after authentication
  
  Examples:
    npm run magic-link user@example.com
    npm run magic-link user@example.com /apps/incidents
    `);
}

async function start() {

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Error: Email is required');
    displayHelp();
    process.exit(1);
  }

  const email = args[0];
  const callbackUrl = args[1];

  const magicLink = await generateMagicLink(email, callbackUrl);

  console.log(`\nMagic link: ${magicLink}\n\n`);
}


if (require.main === module) {
  start();
}

