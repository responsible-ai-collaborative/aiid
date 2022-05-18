describe('The Word Counts Page', () => {
  it('successfully loads', () => {
    cy.visit('/summaries/wordcounts');
  });

  it('word count table should exist', () => {
    cy.visit('/summaries/wordcounts');
    cy.get('[data-cy=wordlist-container]').should('exist').and('be.visible');

    // Check that there are multiple rows
    cy.get('[data-cy=wordlist-container] > * > *').its('length').should('be.gt', 1);
  });

  it('word cloud should exist', () => {
    cy.visit('/summaries/wordcounts');
    cy.get('[data-cy=wordcloud]').should('exist').and('be.visible');

    // Check that there are multiple text nodes
    cy.get('[data-cy=wordcloud] text').its('length').should('be.gt', 1);
  });

  it('words should have length > 2 and count > 10', () => {
    cy.visit('/summaries/wordcounts');

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
  });
});
