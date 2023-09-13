import parseNews from '../fixtures/api/parseNews.json';

describe('The Submit form', () => {
  const url = '/apps/submit';

  const parserURL = '/api/parseNews**';

  it('Should show a translated popover', () => {
    cy.visit(`/es/apps/submit/`);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.get('[data-cy="label-title"]').trigger('mouseenter');

    cy.get('[data-cy="popover-title"]').should('be.visible');

    cy.get('[data-cy="popover-title"]').contains('h5', 'Título').should('exist');

    cy.get('[data-cy="popover-title"]')
      .contains('div', 'La mayoría de los trabajos tienen un')
      .should('exist');
  });

  it('Should work with translated page', () => {
    cy.visit(`/es/apps/submit/`);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertSubmission',
      'insertSubmission',
      {
        data: {
          insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
        },
      }
    );

    cy.get('input[name="url"]').type(
      `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
    );

    cy.get('[data-cy="fetch-info"]').click();

    cy.wait('@parseNews');

    cy.get('input[name="authors"]').type('Something');

    cy.get('[name="incident_date"]').type('2020-01-01');
    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    cy.get('input[name="submitters"]').type('Something');

    cy.get('[data-cy="to-step-3"]').click();

    cy.get('[name="editor_notes"').type('Here are some notes');

    cy.get('button[type="submit"]').click();

    cy.wait('@insertSubmission');

    cy.get('.tw-toast')
      .contains('Informe agregado exitosamente a la cola de revisión.')
      .should('exist');
  });

  it('Should submit on step 1', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertSubmission',
      'insertSubmission',
      {
        data: {
          insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
        },
      }
    );

    cy.get('input[name="url"]').type(
      `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
    );

    cy.get('[data-cy="fetch-info"]').click();

    cy.wait('@parseNews');

    cy.get('input[name="authors"]').type('Something');

    cy.get('[name="incident_date"]').type('2020-01-01');

    cy.get('[data-cy="submit-step-1"]').click();

    cy.get('.tw-toast')
      .contains('Report successfully added to review queue. You can see your submission')
      .should('exist');

    const keys = ['url', 'title', 'authors', 'incident_date'];

    keys.forEach((key) => {
      cy.get(`input[name="${key}"]`).should('have.value', '');
    });
  });

  it('Should submit on step 2', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertSubmission',
      'insertSubmission',
      {
        data: {
          insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
        },
      }
    );

    cy.get('input[name="url"]').type(
      `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
    );

    cy.get('[data-cy="fetch-info"]').click();

    cy.wait('@parseNews');

    cy.get('input[name="authors"]').type('Something');

    cy.get('[name="incident_date"]').type('2020-01-01');

    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    cy.get('input[name="submitters"]').type('Something');

    cy.get('[data-cy="submit-step-2"]').click();

    cy.get('.tw-toast')
      .contains('Report successfully added to review queue. You can see your submission')
      .should('exist');

    cy.waitForStableDOM();

    const keys = ['url', 'title', 'authors', 'incident_date'];

    keys.forEach((key) => {
      cy.get(`input[name="${key}"]`).should('have.value', '');
    });
  });

  it('Should display an error message if data is missing', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'FindIncident' && req.body.variables.query.incident_id == 3456456,
      'findIncident',
      { data: { incident: null } }
    );

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.visit(url);

    cy.contains('button', 'Submit').click();

    cy.contains('Please review. Some data is missing.').should('exist');
  });
});
