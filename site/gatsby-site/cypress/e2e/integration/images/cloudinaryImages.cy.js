describe('Cloudinary Images', () => {
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
    '/cite/10/',
    '/entities/',
    '/entities/facebook/',
    '/blog/incident-report-2023-january/',
    '/taxonomy/cset/',
    '/summaries/wordcounts/',
    '/about/', // doc template
  ];

  paths.forEach((path) => {
    it(`Should not display broken images on page ${path}`, () => {
      cy.visit(path);
      cy.get('body')
        .then(($body) => {
          if ($body.find('[data-cy="cloudinary-image"]').length) {
            return true;
          }
          return false;
        })
        .then((selectorExists) => {
          if (selectorExists) {
            cy.get('[data-cy="cloudinary-image"]').each(($el) => {
              cy.wrap($el)
                .should('have.attr', 'src')
                .then(($src) => {
                  cy.request({
                    url: $src.toString(),
                    failOnStatusCode: false,
                  }).then((resp) => {
                    if (resp.status === 400 || resp.status === 404) {
                      cy.wrap($el).should('have.class', 'hidden');
                    }
                  });
                });
            });
          } else {
            cy.log(`No images found on page, skipping test for path ${path}`);
            it.skip(`Should display a placeholder image if image is failing on page ${path}`, () => {});
          }
        });
    });
  });
});
