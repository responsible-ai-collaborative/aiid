describe('Locale', () => {
  it('Locale folder should contain specific JSON files for all specified languages', () => {
    let availableLanguages = Cypress.env('availableLanguages');

    let enFiles = [];

    cy.task('listFiles', `./i18n/locales/en`).then((files) => {
      enFiles = files;

      if (availableLanguages) {
        availableLanguages = availableLanguages.split(',');

        // check that each locale directory exists with the expected files
        availableLanguages
          .filter((a) => a !== 'en')
          .forEach((locale) => {
            cy.task('listFiles', `./i18n/locales/${locale}`).then((otherLocaleFiles) => {
              expect(otherLocaleFiles.sort()).to.deep.equal(
                enFiles.sort(),
                `Locale ${locale} folder should contain the same files as the en folder`
              );
            });
          });
      }
    });
  });

  it('should have a configuration for each available language', () => {
    const configPath = './i18n/config.json';

    cy.readFile(configPath).then((configurations) => {
      expect(configurations).to.be.an('array');

      const availableLanguages = Cypress.env('availableLanguages').split(',');

      availableLanguages.forEach((locale) => {
        const hasConfig = configurations.some((config) => config.code === locale);

        expect(hasConfig, `Locale ${locale} should have configuration`).to.be.true;
      });
    });
  });
});
