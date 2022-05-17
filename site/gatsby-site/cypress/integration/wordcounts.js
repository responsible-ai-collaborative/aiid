describe('The Word Counts Page', () => {
  it('successfully loads', () => {
    cy.visit('/summaries/wordcounts');
  });

  it('word count table should exist', () => {
    cy.visit('/summaries/wordcounts');
    cy.get('.row .list-group');
    cy.get('.row .list-group > div');
    cy.get('.row .list-group > div > span');
  });

  it('words should have length > 2 and count > 10', () => {
    cy.visit('/summaries/wordcounts');

    // Pull out the words and their counts and then check
    // that the minimum word length and occurence count are accurate
    let counts = [];

    let words = [];

    cy.get('.row .list-group > div')
      .each((row) => {
        words.push(row.text().trim());
        let count = 0;

        let countText = row.find('span').text().trim();

        let spanIsNumeric = /\d+/.test(countText);

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
