describe('Cite pages', () => {
  const discoverUrl = '/apps/discover';

  const url = '/cite/10';

  const dummyIncident = {
    url: '',
    title: '',
    authors: '',
    submitters: '',
    incident_date: '',
    date_published: '',
    date_downloaded: '',
    image_url: '',
    incident_id: '',
    text: '',
    flag: '',
    tags: [],
  };

  it('Successfully loads', () => {
    cy.visit(url);

    cy.disableSmoothScroll();
  });

  it('Should scroll to report when coming from the discover app', () => {
    cy.visit(discoverUrl);

    cy.contains('Show Details on Incident #10').first().click();

    cy.disableSmoothScroll();

    cy.wait(1000);

    cy.window().its('scrollY').should('be.closeTo', 15761, 1000);
  });

  it('Should scroll to report when clicking on a report in the timeline', () => {
    cy.visit(url);

    cy.disableSmoothScroll();

    cy.get('text').contains('For some Starbucks workers, job leaves bitter taste').click();

    cy.wait(1000);

    cy.window().its('scrollY').should('be.closeTo', 4946, 400);
  });

  // Meanwhile there is not reproducible environment skip tests with admin permissions

  const maybeIt = Cypress.env('e2eUsername') && Cypress.env('e2ePassword') ? it : it.skip;

  maybeIt('Should show an edit link to users with the appropriate role', {}, () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const id = 'r5d34b8c29ced494f010ed463';

    cy.visit('/cite/1#' + id);

    cy.get('#' + id)
      .get('[data-cy=edit-report]')
      .should('exist');
  });

  maybeIt('Should show the taxonomy edit form to users with the appropriate role', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const id = 'r5d34b8c29ced494f010ed463';

    cy.visit('/cite/1#' + id);

    cy.get('#' + id)
      .get('[data-cy=taxonomy-form]')
      .should('exist');
  });

  it('Should flag an incident', () => {
    // mock requests until a testing database is implemented
    const _id = '5d34b8c29ced494f010ed470';

    cy.visit(url + '#' + _id);

    cy.intercept('POST', '**/graphql', {
      data: {
        incident: {
          __typename: 'Incident',
          _id,
          ...dummyIncident,
          flag: false,
        },
      },
    }).as('fetchIncident');

    cy.get(`[id="r${_id}"`).find('[data-cy="flag-button"]').click();

    cy.get('[data-cy="flag-modal"]').as('modal').should('be.visible');

    cy.wait('@fetchIncident');

    cy.intercept('POST', '**/graphql', {
      data: {
        updateOneIncident: {
          __typename: 'Incident',
          _id,
          ...dummyIncident,
          flag: true,
        },
      },
    }).as('updateIncident');

    cy.get('@modal').find('[data-cy="flag-toggle"]').click();

    cy.wait('@updateIncident');

    cy.get('@modal').find('[data-cy="flag-toggle"]').should('be.disabled');

    cy.contains('Close').click();

    cy.get('@modal').should('not.exist');
  });
});
