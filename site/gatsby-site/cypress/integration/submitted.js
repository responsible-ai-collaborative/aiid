import submittedReports from '../fixtures/submissions/submitted.json';

describe('Cite pages', () => {
  const url = '/apps/submitted';

  it('Loads submitted reports', () => {
    cy.visit(url);

    cy.conditionalIntercept(
      '**/functions/call',
      (req) => req.body.arguments[0]?.collection == 'submissions' && req.body.name === 'find',
      'submitReport',
      submittedReports
    );

    cy.get('[data-cy="submissions"] > div').should('have.length', submittedReports.length);

    submittedReports.forEach((report, index) => {
      cy.get('[data-cy="submissions"]')
        .children(`:nth-child(${index + 1})`)
        .contains('review >')
        .click();

      cy.get('[data-cy="submissions"]')
        .children(`:nth-child(${index + 1})`)
        .within(() => {
          cy.get('[data-cy="source_domain"]').should('contain', report.source_domain);
          cy.get('[data-cy="authors"]').should('contain', report.authors);
          cy.get('[data-cy="submitters"]').should('contain', report.submitters);
          cy.get('[data-cy="incident_id"]').should('contain', report.incident_id.$numberLong);
          cy.get('[data-cy="date_published"]').should('contain', report.date_published);
          cy.get('[data-cy="date_submitted"]').should('contain', report.date_submitted);
          cy.get('[data-cy="date_downloaded"]').should('contain', report.date_downloaded);
          cy.get('[data-cy="date_modified"]').should('contain', report.date_modified);
          cy.get('[data-cy="url"]').should('contain', report.url);
        });
    });
  });
});
