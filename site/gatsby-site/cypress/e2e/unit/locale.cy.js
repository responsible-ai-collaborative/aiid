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


  it('should have a configuration for each available language', () => {
    cy.task('getLocaleConfigurations').then((configurations) => {
      // Ensure the configurations were loaded
      expect(configurations).to.not.be.null;

      const availableLanguages = Cypress.env('availableLanguages').split(',');

      availableLanguages.forEach((locale) => {
        const hasConfig = configurations.some(config => config.code === locale);
        expect(hasConfig, `Locale ${locale} should have configuration`).to.be.true;
      });
    });
  });
});
