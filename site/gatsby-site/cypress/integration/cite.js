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

  it.skip('Should scroll to report when coming from the discover app', () => {
    cy.visit(discoverUrl);

    cy.contains('Show Details on Incident #10').first().click();

    cy.disableSmoothScroll();

    cy.url().should('include', '/cite/10');

    cy.contains('span', 'Is Starbucks shortchanging its baristas?', { timeout: 8000 })
      .parents('[class*="IncidentCard"]')
      .then((subject) => {
        expect(subject[0].getBoundingClientRect().top).to.be.closeTo(0, 1);
      });
  });

  it('Should scroll to report when clicking on a report in the timeline', () => {
    cy.visit(url);

    cy.wait(2000);

    cy.disableSmoothScroll();

    cy.get('text')
      .contains('For some Starbucks workers, job leaves bitter taste')
      .parents('a')
      .click({ force: true });

    cy.get('span')
      .contains('For some Starbucks workers, job leaves bitter taste')
      .parents('[class*="IncidentCard"]')
      .then((subject) => {
        expect(subject[0].getBoundingClientRect().top).to.be.closeTo(0, 1);
      });
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

  maybeIt('Should show the taxonomy form of CSET', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.get('[data-cy="CSET"]').contains('Edit').click();

    cy.get('[data-cy="CSET"] [data-cy="taxonomy-form"]').as('taxonomyForm');

    cy.get('@taxonomyForm').should('exist');
  });

  maybeIt('Should show the taxonomy form of resources', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.get('[data-cy="resources"]').contains('Edit').click();

    cy.get('[data-cy="resources"] [data-cy="taxonomy-form"]').as('taxonomyForm');

    cy.get('@taxonomyForm').should('exist');
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

  it('Should pre-fill submit report form', () => {
    cy.clock(Date.UTC(2022, 2, 2), ['Date']);

    cy.visit(url);

    cy.contains('New Report').scrollIntoView().click();

    cy.get('[name="incident_id"]').should('have.value', '10');

    cy.get('[name="incident_date"]').should('have.value', '2014-08-14');

    cy.get('[name="date_downloaded"]').should('have.value', '2022-03-02');
  });
});
