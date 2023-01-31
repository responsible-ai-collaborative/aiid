const { switchLocalizedPath } = require('../../../i18n');

const config = require('../../../config');

// To get these tests passing locally you either need a complete build or enabling the DEV_SSR flag

describe('SEO', () => {
  const baseUrl = config.gatsby.siteUrl;

  const paths = [
    '/',
    '/account/',
    '/taxonomies/',
    '/apps/classifications/',
    '/apps/discover/',
    '/apps/incidents/',
    '/apps/newsSearch/',
    '/reports/2302/',
    '/apps/submit/',
    '/apps/submitted/',
    '/apps/variants/',
    '/blog/',
    '/summaries/flagged/',
    '/summaries/incidents/',
    '/summaries/incidentsOverTime/',
    '/summaries/leaderboard/',
    '/summaries/spatial/',
    '/research/snapshots/',
    '/cite/1/',
    '/entities/',
    '/entities/facebook/',
    '/blog/the-first-taxonomy-of-ai-incidents/', // post template
    '/taxonomy/cset/',
    '/summaries/wordcounts/',
    '/about/', // doc template
  ];

  const codes = ['es', 'en', 'fr'];

  paths.forEach((path) => {
    codes.forEach((code) => {
      it(`/${code}${path} Should have proper canonical url`, () => {
        const canonicalPath = switchLocalizedPath({ newLang: code, path });

        const url = baseUrl + canonicalPath;

        cy.visit(canonicalPath);

        cy.get('[rel="canonical"]').invoke('attr', 'href').should('equal', url);
      });
    });
  });
});
