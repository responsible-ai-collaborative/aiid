import { maybeIt } from '../support/utils';
import flaggedReport from '../fixtures/reports/flagged.json';
import unflaggedReport from '../fixtures/reports/unflagged.json';
import { format } from 'date-fns';
const { gql } = require('@apollo/client');

describe('Cite pages', () => {
  const discoverUrl = '/apps/discover';

  const incidentId = 10;

  const url = `/cite/${incidentId}`;

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

    cy.wait(4000);

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

  it('Should show the incident stats table', () => {
    cy.visit(url);
    cy.get('[data-cy=incident-stats]').should('exist');
  });

  it('Should show editors in the stats table', () => {
    cy.visit(url);
    cy.get('[data-cy=incident-stats] > * > *')
      .contains('Editors')
      .parents('*')
      .contains('Sean McGregor');
  });

  maybeIt('Should show an edit link to users with the appropriate role', {}, () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const id = 'r5d34b8c29ced494f010ed463';

    cy.visit('/cite/1#' + id);

    cy.get(`#${id} [data-cy="edit-report"]`).click();

    cy.url().should('contain', '/cite/edit?report_number=10');
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

    cy.get('[data-cy="resources"]', { timeout: 30000 })
      .should('be.visible')
      .contains('Edit')
      .click();

    cy.get('[data-cy="resources"] [data-cy="taxonomy-form"]')
      .should('be.visible')
      .as('taxonomyForm');

    cy.get('@taxonomyForm').should('exist');
  });

  it(`Should taxa table only when there are classifications and the user is not authenticated`, () => {
    cy.visit(url);

    cy.get('[data-cy="CSET"]').should('exist');

    cy.get('[data-cy="resources"]').should('not.exist');
  });

  it('Should flag an incident', () => {
    // mock requests until a testing database is implemented
    const _id = '5d34b8c29ced494f010ed470';

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'fetchReport',
      unflaggedReport
    );

    cy.visit(url + '#' + _id);

    cy.get(`[id="r${_id}"`).find('[data-cy="flag-button"]').click();

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

    cy.contains('Close').click();

    cy.get('@modal').should('not.exist');
  });

  it('Should pre-fill submit report form', () => {
    cy.visit(url);

    cy.contains('New Report').scrollIntoView().click();

    cy.get('[name="incident_id"]').should('have.value', '10');
  });

  it('Should render the TSNE visualization', () => {
    cy.visit(url);
    cy.get('[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"]').should('exist');
  });

  it('The visualization should show the current incident and have it marked as such', () => {
    cy.visit(url);
    cy.get('[data-cy="tsne-visualization"]').scrollIntoView();
    cy.get('#spatial-incident-10.current').should('be.visible');
  });

  it('should render Next and Previous incident buttons', () => {
    cy.visit(url);

    cy.contains('Next Incident').should('be.visible').should('have.attr', 'href', '/cite/11');

    cy.contains('Previous Incident').should('be.visible').should('have.attr', 'href', '/cite/9');
  });

  maybeIt('Should show the edit incident form', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.contains('Edit Incident').click();

    cy.url().should('contain', '/incidents/edit?incident_id=10');

    cy.get('[data-cy="incident-form').should('be.visible');
  });

  it('Should display correct BibTex Citation', () => {
    cy.visit(url);

    const date = format(new Date(), 'MMMMd,y');

    cy.contains('BibTex Citation').scrollIntoView().click();

    cy.get('[data-cy="bibtext-modal"]').should('be.visible').as('modal');

    cy.get('@modal')
      .find('code')
      .invoke('text')
      .then((text) => {
        // would be nice not having to remove especial characters
        // eslint-disable-next-line
        const bibText = text.replace(/(\r\n|\n|\r| |\s)/g, '');

        expect(bibText).to.eq(
          `@article{aiid:10,author={Olsson,Catherine},editor={McGregor,Sean},journal={AIIncidentDatabase},publisher={ResponsibleAICollaborative},title={IncidentNumber10},url={https://incidentdatabase.ai/cite/10},year={2014},urldate={${date}}}`
        );
      });
  });

  it('Should display correct Citation', () => {
    cy.visit(url);

    const date = format(new Date(), 'MMMM d, y');

    cy.get('[data-cy="citation"] .card-body').should(
      'contain.text',
      `Olsson, Catherine. (2014-08-14) Incident Number 10. in McGregor, S. (ed.) Artificial Intelligence Incident Database. Responsible AI Collaborative. Retrieved on ${date} from incidentdatabase.ai/cite/10.`
    );
  });

  it('Should display similar incidents', () => {
    cy.visit('/cite/9');

    cy.get('[data-cy="similar-incident-card"]').should('exist');
  });

  it('Should not display duplicate similar incidents', () => {
    cy.visit('/cite/9');

    const hrefs = new Set();

    cy.get('[data-cy="similar-incident-card"] [data-cy="cite-link"]').each((link) => {
      const href = link[0].href;

      expect(hrefs.has(href)).to.be.false;
      hrefs.add(href);
    });
  });

  it('Should not display edit link when not logged in', () => {
    cy.visit('/cite/9');

    cy.get('[data-cy="edit-similar-incidents"]').should('not.exist');
  });

  maybeIt('Should display edit link when logged in as editor', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit('/cite/9');

    cy.get('[data-cy="edit-similar-incidents"]').should('exist');
  });

  it('Should flag an incident as not related', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident'
    );

    cy.visit('/cite/9');

    cy.get('[data-cy="flag-similar-incident"]').first().click();

    cy.wait('@updateIncident').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
      expect(Boolean(xhr.request.body.variables.set.flagged_dissimilar_incidents)).to.be.true;
    });
  });

  it('Should have OpenGraph meta tags', () => {
    cy.visit(url);

    cy.query({
      query: gql`
        query {
          incidents(query: { incident_id: ${incidentId} }, limit: 1) {
            title
            description
            reports {
              image_url
              date_published
            }
          }
        }
      `,
    }).then(({ data: { incidents } }) => {
      const title = `Incident ${incidentId}`;

      const description = `Citation record for Incident ${incidentId}`;

      const imageUrl = [...incidents[0].reports].sort((a, b) =>
        a.date_published >= b.date_published ? 1 : -1
      )[0].image_url;

      cy.get('head meta[name="title"]').should('have.attr', 'content', title);
      cy.get('head meta[name="description"]').should('have.attr', 'content', description);

      cy.get('head meta[name="twitter:site"]').should('have.attr', 'content', '@IncidentsDB');
      cy.get('head meta[name="twitter:creator"]').should('have.attr', 'content', '@IncidentsDB');

      cy.get('head meta[property="og:url"]').should(
        'have.attr',
        'content',
        `https://incidentdatabase.ai${url}`
      );
      cy.get('head meta[property="og:type"]').should('have.attr', 'content', 'website');
      cy.get('head meta[property="og:title"]').should('have.attr', 'content', title);
      cy.get('head meta[property="og:description"]').should('have.attr', 'content', description);
      cy.get('head meta[property="og:image"]').should('have.attr', 'content', imageUrl);
      cy.get('head meta[property="twitter:title"]').should('have.attr', 'content', title);
      cy.get('head meta[property="twitter:description"]').should(
        'have.attr',
        'content',
        description
      );
      cy.get('head meta[property="twitter:image"]').should('have.attr', 'content', imageUrl);
    });
  });
});
