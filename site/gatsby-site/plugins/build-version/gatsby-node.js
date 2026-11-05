const fs = require('fs');

const path = require('path');

// Writes the commit and release of this build to public/version.json and
// public/version.js. The browser reads them from there (footer, Sentry
// release) instead of having them baked into every HTML page and JS bundle,
// so two builds of the same code produce identical pages and a Netlify deploy
// only uploads the files whose content changed.
exports.onPostBuild = ({ store, reporter }) => {
  const publicDir = path.join(store.getState().program.directory, 'public');

  const commit = process.env.GATSBY_COMMIT_SHA || null;

  const version = {
    commit,
    release: process.env.SENTRY_RELEASE || process.env.GATSBY_SENTRY_RELEASE || commit,
    builtAt: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(publicDir, 'version.json'), JSON.stringify(version));
  fs.writeFileSync(
    path.join(publicDir, 'version.js'),
    `window.AIID_BUILD=${JSON.stringify(version)};`
  );

  reporter.info(`[build-version] wrote version.json for commit ${commit || '(unset)'}`);
};
