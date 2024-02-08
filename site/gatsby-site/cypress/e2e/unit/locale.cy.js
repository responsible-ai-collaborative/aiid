describe('Locale', () => {
  it('Locale folder should contain specific JSON files for all specified languages', () => {
    let availableLanguages = Cypress.env('availableLanguages');

    // Define the list of files you expect to find in each locale directory
    const expectedFiles = [
      'account.json',
      'actions.json',
      'entities.json',
      'footer.json',
      'incidents.json',
      'landing.json',
      'leaderboard.json',
      'login.json',
      'popovers.json',
      'sponsors.json',
      'submit.json',
      'submitted.json',
      'translation.json',
      'validation.json',
      'variants.json',
      'wordcount.json',
    ];

    if (availableLanguages) {
      availableLanguages = availableLanguages.split(',');

      availableLanguages.forEach((locale) => {
        expectedFiles.forEach((fileName) => {
          const filePath = `./i18n/locales/${locale}/${fileName}`;

          cy.readFile(filePath).then((content) => {
            if (content) {
              expect(true).to.be.true; // File exists
            } else {
              assert.fail(`File not found: ${filePath}`); // File does not exist
            }
          });
        });
      });
    }
  });

  it('should have a configuration for each available language', () => {
    const configPath = './i18n/config.json'; // Adjust the path as needed

    // Use Cypress.readFile to read and parse the JSON file
    cy.readFile(configPath).then((configurations) => {
      // Ensure the configurations were loaded
      expect(configurations).to.be.an('array');

      const availableLanguages = Cypress.env('availableLanguages').split(',');

      availableLanguages.forEach((locale) => {
        const hasConfig = configurations.some((config) => config.code === locale);

        expect(hasConfig, `Locale ${locale} should have configuration`).to.be.true;
      });
    });
  });
});
