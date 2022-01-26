/**
 * Invokes translation process without Gatsby build
 * Run with `node ./src/scripts/translate-incident-reports.js`
 */

require('dotenv').config();

const { run } = require('../utils/translateIncidents');

const reporter = { log: console.log };

(async () => {
  console.log('Translating incident reports...');

  await run({ reporter });

  console.log('Done');

  process.exit(0);
})();
