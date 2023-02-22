const { switchLocalizedPath } = require('../../../i18n');

describe('Runtime errors', () => {
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

  const codes = ['en', 'es', 'fr'];

  paths.forEach((path) => {
    codes.forEach((code) => {
      it(`/${code}${path} Should not have hydration errors`, () => {
        const canonicalPath = switchLocalizedPath({ newLang: code, path });

        cy.visit(canonicalPath, {
          onBeforeLoad(win) {
            cy.stub(win.console, 'error').as('consoleError');
          },
        });

        cy.waitForStableDOM();

        cy.get('@consoleError').then((consoleError) => {
          const noHydrationErrors = consoleError
            .getCalls()
            .every((call) => call.args.every((arg) => !arg.includes('did not match')));

          expect(noHydrationErrors, 'No hydration errors').to.be.true;

          expect(consoleError.getCalls().length, 'No runtime errors').eq(0);
        });
      });
    });
  });
});
