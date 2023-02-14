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

  const languages = [
    {
      code: 'en',
      hrefLang: 'en-US',
    },
    {
      code: 'es',
      hrefLang: 'es',
    },
    {
      code: 'fr',
      hrefLang: 'fr',
    },
  ];

  paths.forEach((path) => {
    languages.forEach(({ code }) => {
      it(`/${code}${path} Should have proper SEO Tags`, () => {
        const canonicalPath = switchLocalizedPath({ newLang: code, path });

        const url = baseUrl + canonicalPath;

        cy.visit(canonicalPath);

        cy.get('[rel="canonical"]').invoke('attr', 'href').should('equal', url);

        cy.get('[rel="alternate"]').should('have.length', 5);

        cy.get('[rel="alternate"][hrefLang="x-default"]')
          .invoke('attr', 'href')
          .should('equal', baseUrl);

        cy.get('[rel="alternate"][type="application/rss+xml"]')
          .invoke('attr', 'href')
          .should('equal', '/rss.xml');

        for (const language of languages) {
          const alternatePath = switchLocalizedPath({ newLang: language.code, path });

          const alternateUrl = baseUrl + alternatePath;

          cy.log(canonicalPath, 'tag', language.hrefLang, 'should eq', alternateUrl);

          cy.get(
            `[rel="alternate"][hrefLang="${language.hrefLang}"][href="${alternateUrl}"]`
          ).should('exist');
        }
      });
    });
  });
});
