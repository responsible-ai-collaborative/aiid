import { switchLocalizedPath } from '../../../i18n';
import config from '../../../config';
import isString from 'lodash/isString';

describe('Pages', () => {
  const baseUrl = config.gatsby.siteUrl;

  const paths = [
    '/',
    '/taxonomies/',
    '/apps/discover/',
    '/apps/incidents/',
    '/apps/newsdigest/',
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
    '/entities/',
    '/account/',
    '/summaries/wordcounts/',
    '/about/', // doc template
    '/api-spec',
  ];

  if (!Cypress.env('isEmptyEnvironment')) {
    paths.push('/apps/classifications/');
    paths.push('/reports/2302/');
    paths.push('/cite/1/');
    paths.push('/entities/facebook/');
    paths.push('/blog/incident-report-2023-january/');
    paths.push('/taxonomy/csetv0/');
    paths.push('/taxonomy/csetv1/');
  }

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
    {
      code: 'ja',
      hrefLang: 'ja',
    },
  ];

  paths.forEach((path) => {
    languages.forEach(({ code }) => {
      // TODO: enable when https://github.com/responsible-ai-collaborative/aiid/pull/2616 is merged and deployed
      it.skip(`/${code}${path} Should not have errors`, { defaultCommandTimeout: 30000 }, () => {
        const canonicalPath = switchLocalizedPath({ newLang: code, path });

        cy.visit(canonicalPath, {
          onBeforeLoad(win) {
            cy.stub(win.console, 'error').as('consoleError');
          },
        });

        cy.waitForStableDOM();

        // check for runtime errors

        cy.get('@consoleError').then((consoleError) => {
          const errors = [];

          consoleError.getCalls().forEach((call) =>
            call.args.forEach((arg) => {
              if (
                isString(arg) &&
                (arg.includes('did not match') || arg.includes('Minified React error'))
              ) {
                errors.push(arg);
              }
            })
          );

          expect(errors.length, `No hydration errors:\n ${errors.join(', ')}`).to.eq(0);

          // This should be enabled once the app is free of warnings

          // expect(
          //   consoleError.getCalls().length,
          //   'No runtime errors: ' + JSON.stringify(consoleError.getCalls())
          // ).eq(0);
        });

        // check for SEO tags

        const url = baseUrl + canonicalPath;

        cy.get('[rel="canonical"]').invoke('attr', 'href').should('equal', url);

        cy.get('[rel="alternate"]').should('have.length', 6);

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

      it.skip(
        `/${code}${path} Should load images properly`,
        { defaultCommandTimeout: 30000 },
        () => {
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
                    .scrollIntoView()
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
        }
      );
    });
  });
});
