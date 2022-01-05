/**
 * Updates Algolia indexes without Gatsby build
 * Run with `node ./src/scripts/algolia-update.js`
 */

require('dotenv').config();

const { run } = require('../utils/updateDiscoverIndexes');

const reporter = { log: console.log };

(async () => {
  console.log('Updating Algolia indexes...');

  await run({ reporter });

  console.log('Done');

  process.exit(0);
})();
