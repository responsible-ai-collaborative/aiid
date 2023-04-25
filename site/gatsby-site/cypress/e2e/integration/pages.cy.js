import { switchLocalizedPath } from '../../../i18n';

import config from '../../../config';

describe('Pages', () => {
  const baseUrl = config.gatsby.siteUrl;

  const paths = [
    '/',
    '/account/',
    '/taxonomies/',
    '/apps/classifications/',
    '/apps/discover/',
    '/apps/incidents/',
    '/apps/newsdigest/',
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
    '/blog/incident-report-2023-january/',
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
      it.skip(`/${code}${path} Should not have errors`, () => {
        const canonicalPath = switchLocalizedPath({ newLang: code, path });

        cy.visit(canonicalPath, {
          onBeforeLoad(win) {
            cy.stub(win.console, 'error').as('consoleError');
          },
        });

        cy.waitForStableDOM();

        // check for runtime errors

        cy.get('@consoleError').then((consoleError) => {
          const noHydrationErrors = consoleError
            .getCalls()
            .every((call) =>
              call.args.every(
                (arg) => !arg.includes('did not match') || !arg.includes('Minified React error')
              )
            );

          expect(noHydrationErrors, 'No hydration errors').to.be.true;

          // This should be enabled once the app is free of warnings

          // expect(
          //   consoleError.getCalls().length,
          //   'No runtime errors: ' + JSON.stringify(consoleError.getCalls())
          // ).eq(0);
        });

        // check for SEO tags

        const url = baseUrl + canonicalPath;

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

        cy.get('body')
          .then(($body) => {
            if ($body.find('[data-cy="cloudinary-image-wrapper"]').length) {
              return true;
            }
            return false;
          })
          .then((selectorExists) => {
            if (selectorExists) {
              cy.get('[data-cy="cloudinary-image-wrapper"]').each(($el) => {
                cy.wrap($el)
                  .find('[data-cy="cloudinary-image"]')
                  .should('have.attr', 'src')
                  .then(($src) => {
                    cy.request({
                      url: $src.toString(),
                      failOnStatusCode: false,
                    }).then((resp) => {
                      if (resp.status !== 200) {
                        // If image is failing, check if cloudinary image is hidden
                        cy.wrap($el)
                          .find('[data-cy="cloudinary-image"]')
                          .should('have.class', 'hidden');
                        // Check if placeholder image is displayed instead
                        cy.wrap($el)
                          .find('[data-cy="cloudinary-image-placeholder"]')
                          .should('not.have.class', 'hidden');
                      }
                    });
                  });
              });
            } else {
              cy.log(`No images found on page, skipping image test for path ${path}`);
            }
          });
      });
    });
  });
});
