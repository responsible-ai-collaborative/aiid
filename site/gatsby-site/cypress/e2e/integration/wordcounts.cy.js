import { conditionalIt } from '../../support/utils';

describe('The Word Counts Page', () => {
  const url = '/summaries/wordcounts';

  it('successfully loads', () => {
    cy.visit(url);
  });

  conditionalIt(
    Cypress.env('isEmptyEnvironment'),
    'Should display a message if no data is presented',
    () => {
      cy.visit(url);
      cy.waitForStableDOM();
      cy.get('[data-cy=wordlist-container]').should('not.exist');
      cy.contains('There are no reports or incidents to process')
        .should('exist')
        .should('be.visible');
    }
  );

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Word count table should exist', () => {
    cy.visit(url);
    cy.get('[data-cy=wordlist-container]').should('exist').and('be.visible');

    // Check that there are multiple rows
    cy.get('[data-cy=wordlist-container] > * > *').its('length').should('be.gt', 1);
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Word cloud should exist', () => {
    cy.visit(url);
    cy.get('[data-cy=wordcloud]').should('exist').and('be.visible');

    // Check that there are multiple text nodes
    cy.get('[data-cy=wordcloud] text').its('length').should('be.gt', 1);
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Words should have length > 2 and count > 10',
    () => {
      cy.visit(url);

      // Pull out the words and their counts and then check
      // that the minimum word length and occurence count are accurate
      const counts = [];

      const words = [];

      cy.get('[data-cy=wordlist-container] > * > *')
        .each((row) => {
          words.push(row.text().trim());

          const countText = row.find('span').text().trim();

          const spanIsNumeric = /\d+/.test(countText);

          let count = 0;

          if (spanIsNumeric) {
            count = parseInt(countText);
          }
          counts.push(count);
        })
        .then(() => {
          const ascending = (a, b) => a - b;

          expect(words.map((word) => word.length).sort(ascending)[0] > 2).to.be.true;
          expect(counts.sort(ascending)[0] > 9).to.be.true;
        });
    }
  );
});
