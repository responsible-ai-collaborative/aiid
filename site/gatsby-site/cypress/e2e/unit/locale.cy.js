describe('Locale', () => {
  it('Locale folder should exist for all specified languages', () => {
    let availableLanguages = Cypress.env('availableLanguages');

    if (availableLanguages) {
      availableLanguages = availableLanguages.split(',');

      availableLanguages.forEach((locale) => {
        cy.task('checkDirectoryExists', { locale }).then((exists) => {
          expect(exists).to.be.true;
        });
      });
    }
  });
});
