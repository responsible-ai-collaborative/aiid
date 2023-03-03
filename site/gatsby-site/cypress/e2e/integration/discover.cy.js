import flaggedReport from '../../fixtures/reports/flagged.json';
import unflaggedReport from '../../fixtures/reports/unflagged.json';

describe('The Discover app', () => {
  const url = '/apps/discover';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should default to incident reports and show at least 30', () => {
    cy.visit(url);

    cy.location('search', { timeout: 8000 }).should('contain', 'is_incident_report=true');

    cy.contains('[data-cy="display-options"]', 'Incident Reports')
      .should('exist')
      .and('be.visible');

    cy.get('div[class^="tw-hits-container"]').children().should('have.length.at.least', 28);
  });

  it('Performs a search and filters results', () => {
    cy.visit(url);

    cy.get('form#searchForm').as('form');

    cy.get('@form').get('input[placeholder="Type Here"]').type('starbucks').type('{enter}');

    cy.url().should('include', 's=starbucks');

    // a flaky assertion here, should improve once a testing enviqronment is set up
    cy.get('div[class^="tw-hits-container"]').children().should('have.length.at.least', 8);
  });

  it('Filters by incident Id using top filters', { retries: { runMode: 4 } }, () => {
    cy.visit(url);

    cy.get('[data-cy=expand-filters]').click();

    cy.waitForStableDOM();

    cy.contains('button', 'Incident ID').click();

    cy.waitForStableDOM();

    cy.get('.card [placeholder="Type Here"]', { timeout: 8000 }).type('34').type('{enter}');

    cy.get('.list-group-item:contains("34")', { timeout: 8000 }).first().click();

    cy.url().should('include', 'incident_id=34');

    cy.get('div[class^="tw-hits-container"]').children().should('have.length.at.least', 28);
  });

  it('Filters by incident Id using card button', { retries: { runMode: 4 } }, () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.get('[data-cy=expand-filters]').click();

    cy.waitForStableDOM();

    cy.get('div[class^="tw-hits-container"]')
      .children()
      .get('[title="Filter by Incident ID #10"]')
      .first()
      .click();

    cy.waitForStableDOM();

    cy.contains('button', 'Incident ID', { timeout: 8000 })
      .find('span.badge', { timeout: 8000 })
      .should('contain.text', '1');

    cy.url().should('include', 'incident_id=10');

    cy.get('div[class^="tw-hits-container"]').children().should('have.length.at.least', 8);
  });

  it('Should flag an incident', () => {
    // mock requests until a testing database is implemented

    cy.visit(
      url +
        '?display=details&incident_id=10&s=%E2%80%8BIs%20Starbucks%20shortchanging%20its%20baristas%3F'
    );

    const _id = '5d34b8c29ced494f010ed470';

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'fetchReport',
      unflaggedReport
    );

    cy.get(`[data-cy="${_id}"`).find('[data-cy="flag-button"]').click();

    cy.get('[data-cy="flag-modal"]').as('modal').should('be.visible');

    cy.wait('@fetchReport');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      flaggedReport
    );

    cy.get('@modal').find('[data-cy="flag-toggle"]').click();

    cy.wait('@updateReport');

    cy.get('@modal').find('[data-cy="flag-toggle"]').should('be.disabled');

    cy.get('[aria-label="Close"]').click();

    cy.get('@modal').should('not.exist');
  });

  it('Opens an archive link', () => {
    cy.visit(url, {
      onBeforeLoad: (win) => {
        cy.stub(win, 'open', () => {}).as('windowOpen');
      },
    });

    cy.get('[data-cy="web-archive-link"] .dropdown-toggle').first().click();

    cy.get('[data-cy="original"]')
      .first()
      .should('be.visible')
      .should('have.attr', 'target', '_blank')
      .invoke('attr', 'href')
      .then((href) => {
        expect(href).to.not.contain('web.archive.org');
      });

    cy.get('[data-cy="wayback-machine"]').first().should('be.visible').click();

    cy.get('@windowOpen').should('be.called');
  });

  it("Let's you filter by type", () => {
    cy.visit(url);

    cy.contains('[data-cy="display-options"]', 'Incident Reports').scrollIntoView().click();

    cy.contains('li', /^Issue Reports$/).click();

    cy.location('search', { timeout: 8000 }).should('contain', 'is_incident_report=false');

    cy.contains('[data-cy="display-options"]', 'Issue Reports').should('be.be.visible');
  });

  it('Clear filters button should be enabled if other than Incident Reports is selected', () => {
    cy.visit(url);

    cy.contains('button', 'Clear Filter').should('be.disabled');

    cy.contains('[data-cy="display-options"]', 'Incident Reports').scrollIntoView().click();

    cy.contains('li', /^Incidents$/).click();

    cy.contains('button', 'Clear Filter').should('not.be.disabled');

    cy.contains('[data-cy="display-options"]', 'Incidents').click();

    cy.contains('li', /^Issue Reports$/).click();

    cy.contains('button', 'Clear Filter').should('not.be.disabled');

    cy.contains('[data-cy="display-options"]', 'Issue Reports').click();

    cy.contains('li', /^Incident and Issue Reports$/).click();

    cy.contains('button', 'Clear Filter').should('not.be.disabled');

    cy.contains('[data-cy="display-options"]', 'Incident and Issue Reports').click();

    cy.contains('li', /^Incident Reports$/).click();

    cy.contains('button', 'Clear Filter').should('be.disabled');
  });

  it('Should sort by incident date', () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.get('[data-cy="discover-sort"]', { timeout: 10000 }).click();

    cy.waitForStableDOM();

    cy.get('[data-cy="incident-date-asc-sort"]', { timeout: 10000 }).click();

    cy.waitForStableDOM();

    cy.get('[data-cy="discover-sort"]').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="discover-sort"]').should('have.text', 'Oldest Incident Date');

    cy.get('[data-cy=incident-date]').then((dates) => {
      let firstDateValue = parseInt(dates.eq(0).val().toString());

      let secondDateValue = parseInt(dates.eq(1).val().toString());

      cy.wrap(dates.eq(1)).invoke('val').then(parseFloat).should('be.gte', firstDateValue);

      cy.wrap(dates.eq(2)).invoke('val').then(parseFloat).should('be.gte', secondDateValue);
    });
  });

  it('Should sort by published date', () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.get('[data-cy="discover-sort"]').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="published-date-desc-sort"]', { timeout: 10000 }).click();

    cy.waitForStableDOM();

    cy.get('[data-cy="discover-sort"]').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="discover-sort"]').should('have.text', 'Newest Published Date');

    cy.get('[data-cy=date-published]').then((dates) => {
      let secondDateValue = parseInt(dates.eq(1).val().toString());

      let thirdDateValue = parseInt(dates.eq(2).val().toString());

      cy.wrap(dates.eq(0)).invoke('val').then(parseFloat).should('be.gte', secondDateValue);

      cy.wrap(dates.eq(1)).invoke('val').then(parseFloat).should('be.gte', thirdDateValue);
    });
  });

  it('Should display incidents instead of reports when selection Incidents view', () => {
    cy.visit(url);

    cy.contains('[data-cy="display-options"]', 'Incidents').click();

    cy.contains('li', /^Incidents$/).click();

    cy.location('search', { timeout: 8000 }).should('contain', 'is_incident_report=true');
    cy.location('search', { timeout: 8000 }).should('contain', 'hideDuplicates=1');
  });

  it('Should not add a trailing slash when loading the discover app', () => {
    cy.visit(url);

    cy.location('search', { timeout: 8000 }).should(
      'equal',
      '?display=details&is_incident_report=true&page=1&sortBy=relevance'
    );
  });

  it('Should set the sort with the value from the URL', () => {
    cy.visit(url);

    cy.location('search', { timeout: 8000 }).should(
      'equal',
      '?display=details&is_incident_report=true&page=1&sortBy=relevance'
    );

    cy.get('[data-cy="discover-sort"]').should('have.text', 'Relevance');

    let newUrl = url + '?display=details&is_incident_report=true&page=1&sortBy=incident-date-desc';

    cy.visit(newUrl);

    cy.get('[data-cy="discover-sort"]').should('have.text', 'Newest Incident Date');
  });
});
