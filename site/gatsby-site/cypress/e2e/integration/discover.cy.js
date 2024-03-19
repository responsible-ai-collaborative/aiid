import flaggedReport from '../../fixtures/reports/flagged.json';
import unflaggedReport from '../../fixtures/reports/unflagged.json';
import config from '../../../config';
import path from 'path';
import { format, getUnixTime } from 'date-fns';
import { deleteReportTypenames, transformReportData } from '../../../src/utils/reports';
import { conditionalIt } from '../../support/utils';

describe('The Discover app', () => {
  const url = '/apps/discover';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  conditionalIt(
    Cypress.env('isEmptyEnvironment'),
    'Should display empty state when no incidents are available',
    () => {
      cy.visit(url);

      cy.waitForStableDOM();

      cy.location('search', { timeout: 8000 }).should('contain', 'is_incident_report=true');

      cy.get('div[data-cy="hits-container"]').should('not.exist');

      cy.contains('Your search returned no results.').should('exist').and('be.visible');
    }
  );

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Should default to incident reports and show at least 30',
    () => {
      cy.visit(url);

      cy.waitForStableDOM();

      cy.location('search', { timeout: 8000 }).should('contain', 'is_incident_report=true');

      cy.contains('[data-cy="display-options"]', 'Incident Reports')
        .should('exist')
        .and('be.visible');

      cy.get('div[data-cy="hits-container"]').children().should('have.length.at.least', 28);
    }
  );

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Performs a search and filters results', () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.get('form#searchForm').as('form');

    cy.get('@form')
      .get('[data-cy="search-box"] input[placeholder="Type Here"]')
      .type('starbucks')
      .type('{enter}');

    cy.waitForStableDOM();

    cy.url().should('include', 's=starbucks');

    cy.waitForStableDOM();

    cy.get('div[data-cy="hits-container"]').children().should('have.length.at.least', 8);
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Filters by incident Id using top filters',
    () => {
      cy.visit(url);

      cy.waitForStableDOM();

      cy.get('[data-cy=expand-filters]').click();

      cy.waitForStableDOM();

      cy.contains('button', 'Incident ID').click();

      cy.waitForStableDOM();

      cy.get('[data-cy="incident_id"] [placeholder="Type Here"]', { timeout: 8000 })
        .type('34')
        .type('{enter}');

      cy.get('[data-cy="incident_id-item"]:contains("34")', { timeout: 8000 }).first().click();

      cy.waitForStableDOM();

      cy.url().should('include', 'incident_id=34');

      cy.waitForStableDOM();

      cy.get('div[data-cy="hits-container"]').children().should('have.length.at.least', 28);
    }
  );

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Filters by Language using top filters', () => {
    cy.visit(url);

    cy.get('[data-cy=expand-filters]').click();

    cy.waitForStableDOM();

    cy.contains('button', 'Language').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="language"] [placeholder="Type Here"]', { timeout: 8000 })
      .type('es')
      .type('{enter}');

    cy.get('[data-cy="language-item"]:contains("es")', { timeout: 8000 }).first().click();

    cy.url().should('include', 'language=es');

    cy.waitForStableDOM();

    cy.get('div[data-cy="hits-container"]').children().should('have.length.at.least', 4);
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Shows expected filters', () => {
    cy.viewport(1920, 1080);

    cy.visit(url);

    cy.waitForStableDOM();

    cy.contains('button', 'Classifications').should('be.visible');
    cy.contains('button', 'Language').should('not.be.visible');
    cy.contains('button', 'Submitter').should('not.be.visible');

    cy.viewport(1280, 1080);
    cy.waitForStableDOM();

    cy.contains('button', 'Classifications').should('be.visible');
    cy.contains('button', 'Language').should('be.visible');
    cy.contains('button', 'Submitter').should('not.be.visible');

    cy.get('[data-cy=expand-filters]').click();

    cy.contains('button', 'Classifications').should('be.visible');
    cy.contains('button', 'Language').should('be.visible');
    cy.contains('button', 'Submitter').should('be.visible');

    cy.viewport(1920, 1080);
    cy.waitForStableDOM();

    cy.contains('button', 'Classifications').should('be.visible');
    cy.contains('button', 'Language').should('be.visible');
    cy.contains('button', 'Submitter').should('be.visible');
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Filters by Tags using top filters', () => {
    cy.visit(url);

    cy.get('[data-cy=expand-filters]').click();

    cy.waitForStableDOM();

    cy.contains('button', 'Tags').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="tags"] [placeholder="Type Here"]', { timeout: 8000 })
      .type('response')
      .type('{enter}');

    cy.get('[data-cy="tags-item"]:contains("response")', { timeout: 8000 }).first().click();

    cy.waitForStableDOM();

    cy.url().should('include', 'tags=response');

    cy.waitForStableDOM();

    cy.get('div[data-cy="hits-container"]').children().should('have.length.at.least', 1);
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Filters by incident Id using card button',
    () => {
      cy.visit(url);

      cy.waitForStableDOM();

      cy.get('[data-cy=expand-filters]').click();

      cy.waitForStableDOM();

      cy.get('div[data-cy="hits-container"]')
        .children()
        .get('[title="Filter by Incident ID #10"]')
        .first()
        .click();

      cy.waitForStableDOM();

      cy.contains('button', 'Incident ID', { timeout: 8000 })
        .find('span.badge', { timeout: 8000 })
        .should('contain.text', '1');

      cy.url().should('include', 'incident_id=10');

      cy.waitForStableDOM();

      cy.get('div[data-cy="hits-container"]').children().should('have.length.at.least', 8);
    }
  );

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Should flag an incident', () => {
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

    cy.get('[data-cy="flag-report-23"]').as('modal').should('be.visible');

    cy.wait('@fetchReport');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      flaggedReport
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logReportHistory',
      'logReportHistory',
      {
        data: {
          logReportHistory: {
            report_number: 10,
          },
        },
      }
    );

    const now = new Date();

    cy.clock(now);

    cy.get('@modal').find('[data-cy="flag-toggle"]').click();

    cy.wait('@updateReport')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.report_number).to.equal(23);
        expect(variables.set).deep.eq({
          flag: true,
          date_modified: format(now, 'yyyy-MM-dd'),
          epoch_date_modified: getUnixTime(now),
        });
      });

    cy.wait('@logReportHistory')
      .its('request.body.variables.input')
      .then((input) => {
        const expectedReport = deleteReportTypenames(
          transformReportData(flaggedReport.data.updateOneReport)
        );

        expectedReport.modifiedBy = '';
        expectedReport.date_modified = format(now, 'yyyy-MM-dd');
        expectedReport.epoch_date_modified = getUnixTime(now);

        expect(input).to.deep.eq(expectedReport);
      });

    cy.get('@modal').find('[data-cy="flag-toggle"]').should('be.disabled');

    cy.get('@modal').find('[aria-label="Close"]').click();

    cy.get('@modal').should('not.exist');
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Opens an archive link', () => {
    cy.visit(url, {
      onBeforeLoad: (win) => {
        cy.stub(win, 'open', () => {}).as('windowOpen');
      },
    });

    cy.get('[data-cy="web-archive-link"] [data-cy="dropdown-toggle"]').first().click();

    cy.get('[data-cy="original"]')
      .first()
      .should('be.visible')
      .click()
      .then((href) => {
        expect(href).to.not.contain('web.archive.org');
      });

    cy.get('[data-cy="web-archive-link"] [data-cy="dropdown-toggle"]').first().click();

    cy.get('[data-cy="wayback-machine"]').first().should('be.visible').click();

    cy.get('@windowOpen').should('be.called');
  });

  it('Lets you filter by type', () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.contains('[data-cy="display-options"]', 'Incident Reports').scrollIntoView().click();

    cy.contains('li', /^Issue Reports$/).click();

    cy.waitForStableDOM();

    cy.location('search', { timeout: 8000 }).should('contain', 'is_incident_report=false');

    cy.waitForStableDOM();

    cy.contains('[data-cy="display-options"]', 'Issue Reports').should('be.be.visible');
  });

  it('Clear filters button should be enabled if other than Incident Reports is selected', () => {
    cy.visit(url);

    cy.contains('button', 'Clear Filter').should('be.disabled');

    cy.waitForStableDOM();

    cy.contains('[data-cy="display-options"]', 'Incident Reports').scrollIntoView().click();

    cy.contains('li', /^Incidents$/).click();

    cy.contains('button', 'Clear Filter').should('not.be.disabled');

    cy.waitForStableDOM();

    cy.contains('[data-cy="display-options"]', 'Incidents').click();

    cy.contains('li', /^Issue Reports$/).click();

    cy.contains('button', 'Clear Filter').should('not.be.disabled');

    cy.waitForStableDOM();

    cy.contains('[data-cy="display-options"]', 'Issue Reports').click();

    cy.contains('li', /^Incident and Issue Reports$/).click();

    cy.contains('button', 'Clear Filter').should('not.be.disabled');

    cy.waitForStableDOM();

    cy.contains('[data-cy="display-options"]', 'Incident and Issue Reports').click();

    cy.contains('li', /^Incident Reports$/).click();

    cy.contains('button', 'Clear Filter').should('be.disabled');
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Should sort by incident date', () => {
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

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Should sort by published date', () => {
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

    cy.waitForStableDOM();

    cy.contains('[data-cy="display-options"]', 'Incidents').click();

    cy.contains('li', /^Incidents$/).click();

    cy.waitForStableDOM();

    cy.location('search', { timeout: 8000 }).should('contain', 'is_incident_report=true');
    cy.location('search', { timeout: 8000 }).should('contain', 'hideDuplicates=1');
  });

  it('Should not add a trailing slash when loading the discover app', () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.location('search', { timeout: 8000 }).should('equal', '?is_incident_report=true');
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Should export results to a CSV file', () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.get('form#searchForm').as('form');

    cy.get('@form')
      .get('[data-cy="search-box"] input[placeholder="Type Here"]')
      .type('starbucks')
      .type('{enter}');

    cy.waitForStableDOM();

    cy.get('[data-cy=export-to-csv]').click();

    const downloadsFolder = Cypress.config('downloadsFolder');

    cy.readFile(path.join(downloadsFolder, 'discover_incidents.csv'), { timeout: 15000 }).then(
      (file) => {
        expect(file).to.have.length.greaterThan(10);
      }
    );
  });

  it(`Shouldn't export results to a CSV file if no results are displayed`, () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.get('form#searchForm').as('form');

    cy.waitForStableDOM();

    cy.get('@form')
      .get('[data-cy="search-box"] input[placeholder="Type Here"]')
      .type('xxxxxxxxxxxxx', { waitForAnimations: false })
      .type('{enter}', { waitForAnimations: false });

    cy.waitForStableDOM();

    cy.url().should('include', 's=xxxxxxxxxxxxx');

    cy.get('[data-cy=export-to-csv]').should('be.disabled');
  });

  it('Should set the sort with the value from the URL', () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.location('search', { timeout: 8000 }).should('equal', '?is_incident_report=true');

    cy.get('[data-cy="discover-sort"]').should('have.text', 'Relevance');

    let newUrl = url + '?display=details&is_incident_report=true&page=1&sortBy=incident-date-desc';

    cy.visit(newUrl);

    cy.get('[data-cy="discover-sort"]').should('have.text', 'Newest Incident Date');
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Should default to the featured incidents',
    () => {
      cy.visit(url);

      for (const item of config.header.search.featured) {
        const [report_number] = Object.entries(item).flat();

        cy.get(`[data-cy-report-number="${report_number}"]`).should('be.visible');
      }
    }
  );

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Performs a search and filters results by source',
    () => {
      cy.visit(url);

      cy.waitForStableDOM();

      cy.get('form#searchForm').as('form');

      // Search by text first
      cy.get('@form')
        .get('[data-cy="search-box"] input[placeholder="Type Here"]')
        .type('google')
        .type('{enter}');

      cy.waitForStableDOM();

      cy.url().should('include', 's=google');

      // Filter by source
      cy.get('[data-cy=expand-filters]').click();

      cy.waitForStableDOM();

      cy.contains('button', 'Source').click();

      cy.waitForStableDOM();

      cy.get('[data-cy="source_domain"] [placeholder="Type Here"]', { timeout: 8000 })
        .type('theguardian.com')
        .type('{enter}');

      cy.get('[data-cy="source_domain-item"]:contains("theguardian.com")', { timeout: 8000 })
        .first()
        .click();

      cy.waitForStableDOM();

      cy.url().should('include', 'source_domain=theguardian.com');

      cy.waitForStableDOM();

      cy.get('div[data-cy="hits-container"]').children().should('have.length.at.least', 8);
    }
  );

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Loads filters based on URL', () => {
    cy.visit(
      url +
        '?is_incident_report=true&submitters=Anonymous&page=3&classifications=CSETv0%3AIntent%3AAccident'
    );

    cy.waitForStableDOM();

    cy.get('form#searchForm').as('form');

    cy.contains('button', 'Submitters', { timeout: 8000 })
      .find('span.badge', { timeout: 8000 })
      .should('contain.text', '1');

    cy.get('[data-cy="Accident"]', { timeout: 8000 })
      .should('exist')
      .find('b')
      .contains('CSETv0')
      .parent()
      .contains('Intent')
      .should('exist')
      .parent()
      .contains('Accident')
      .should('exist')
      .parent()
      .should('have.class', 'active');

    cy.contains('button', 'Anonymous').should('have.class', 'active');

    cy.contains('li.ais-Pagination-item--selected .ais-Pagination-link', '3');

    cy.visit(
      url +
        '?authors=Christopher%20Knaus&incident_id=57&is_incident_report=true&language=en&source_domain=theguardian.com'
    );

    cy.contains('button', 'Authors', { timeout: 8000 })
      .find('span.badge', { timeout: 8000 })
      .should('contain.text', '1');

    cy.contains('button', 'Source', { timeout: 8000 })
      .find('span.badge', { timeout: 8000 })
      .should('contain.text', '1');

    cy.contains('button', 'Incident ID', { timeout: 8000 })
      .find('span.badge', { timeout: 8000 })
      .should('contain.text', '1');

    cy.contains('button', 'Language', { timeout: 8000 })
      .find('span.badge', { timeout: 8000 })
      .should('contain.text', '1');
  });

  it('Should update display types', () => {
    cy.visit(url + '?display=list');

    cy.get('[data-cy="display-mode-list"]').should('have.class', 'selected');

    cy.waitForStableDOM();

    cy.get('[data-cy="display-mode-compact"]').click();

    cy.waitForStableDOM();

    cy.location('search', { timeout: 8000 }).should('contain', 'display=compact');

    cy.get('[data-cy="display-mode-compact"]').should('have.class', 'selected');

    cy.waitForStableDOM();

    cy.get('[data-cy="display-mode-details"]').click();

    cy.waitForStableDOM();

    cy.location('search', { timeout: 8000 }).should('contain', 'display=details');

    cy.get('[data-cy="display-mode-details"]').should('have.class', 'selected');
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Search using the classifications filter',
    () => {
      cy.visit(url);

      cy.waitForStableDOM();

      cy.get('[data-cy=expand-filters]').click();

      cy.contains('button', 'Classifications').click();

      cy.get('[data-cy="search"] input').type('Buenos Aires');

      cy.get('[data-cy="attributes"] [data-cy="Named Entities"]').contains('Buenos Aires').click();

      cy.waitForStableDOM();

      cy.url().should('include', 'classifications=CSETv0%3ANamed%20Entities%3ABuenos%20Aires');

      cy.get('[data-cy="selected-refinements"]')
        .contains('CSETv0 : Named Entities : Buenos Aires')
        .should('be.visible');

      cy.get('div[data-cy="hits-container"]').children().should('have.length.at.least', 1);
    }
  );
});
