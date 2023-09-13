import parseNews from '../fixtures/api/parseNews.json';

describe('The Submit form', () => {
  const url = '/apps/submit';

  const parserURL = '/api/parseNews**';

  it('Should fetch the news if the url param is in the querystring', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.intercept('GET', parserURL, cy.spy().as('parseNewsSpy'));

    cy.visit(
      `${url}?url=https%3A%2F%2Fwww.arstechnica.com%2Fgadgets%2F2017%2F11%2Fyoutube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons%2F`
    );

    cy.wait('@parseNews');

    cy.get('.tw-toast')
      .contains('Please verify all information programmatically pulled from the report')
      .should('exist');

    cy.get('input[name="url"]').type(`https://skylightcyber.com/2019/07/18/cylance-i-kill-you/`);

    cy.get('@parseNewsSpy').should('have.been.calledOnce');
  });

  it('Should load from localstorage', () => {
    const values = {
      url: 'https://incidentdatabase.ai',
      authors: ['test author'],
      title: 'test title',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      image_url: 'https://incidentdatabase.ai/image.jpg',
      incident_ids: [1],
      text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
      submitters: ['test submitters'],
      tags: ['test tags'],
      source_domain: `incidentdatabase.ai`,
      cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
      editor_notes: 'Here are some notes',
    };

    cy.visit(url, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem('formValues', JSON.stringify(values));
      },
    });

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

    cy.intercept('GET', parserURL).as('parseNews');

    cy.waitForStableDOM();

    cy.get('[data-cy="submit-step-1"]').click();

    cy.wait('@insertSubmission').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.nested.include({
        ...values,
        incident_ids: [1],
        authors: values.authors,
        submitters: values.submitters,
        tags: values.tags,
        plain_text:
          'Sit quo accusantium\n\nquia assumenda. Quod delectus similique labore optio quaease\n',
        source_domain: `incidentdatabase.ai`,
        cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
        editor_notes: 'Here are some notes',
      });
    });
  });

  it('Should save form data in local storage', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.visit(url);

    const valuesStep1 = {
      url: 'https://incidentdatabase.ai',
      title: 'test title',
      authors: 'test author',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      incident_date: '2020-01-01',
    };

    for (const key in valuesStep1) {
      if (key == 'incident_ids') {
        cy.get(`input[name="${key}"]`).type(valuesStep1[key]);

        cy.waitForStableDOM();

        cy.get(`[role="option"]`).first().click();
      } else {
        cy.get(`[name="${key}"]`).type(valuesStep1[key]);
      }
    }

    cy.waitForStableDOM();

    cy.setEditorText(
      'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease'
    );
    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    const valuesStep2 = {
      submitters: 'test submitter',
      image_url: 'https://incidentdatabase.ai/image.jpg',
      language: 'en',
    };

    for (const key in valuesStep2) {
      cy.get(`[name="${key}"]`).type(valuesStep2[key]);
    }
    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-3"]').click();

    const valuesStep3 = {
      developers: 'test developer',
      deployers: 'test deployer',
      harmed_parties: 'test harmed_parties',
      editor_notes: 'Here are some notes',
    };

    for (const key in valuesStep3) {
      cy.get(`[name="${key}"]`).type(valuesStep3[key]);
    }
    cy.waitForStableDOM();

    cy.getAllLocalStorage().then((result) => {
      const formValues = JSON.parse(
        result[Cypress.config().baseUrl.replace(/\/$/, '')].formValues.toString()
      );

      expect(formValues).to.deep.equal({
        ...valuesStep1,
        ...valuesStep2,
        ...valuesStep3,
        authors: [valuesStep1.authors],
        submitters: [valuesStep2.submitters],
        tags: [],
        developers: [valuesStep3.developers],
        deployers: [valuesStep3.deployers],
        harmed_parties: [valuesStep3.harmed_parties],
        nlp_similar_incidents: [],
        cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
        text: 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease',
        incident_ids: [],
        incident_editors: [],
      });
    });
  });

  it('Should clear form', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    const values = {
      url: 'https://incidentdatabase.ai',
      authors: 'test author',
      title: 'test title',
      date_published: '2021-01-02',
      incident_ids: [1],
    };

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

    const params = new URLSearchParams(values);

    cy.visit(url + `?${params.toString()}`);

    cy.waitForStableDOM();

    cy.get('[data-cy="clear-form"]').click();

    cy.waitForStableDOM();

    for (const key in values) {
      cy.get(`input[name="${key}"]`).should('have.value', '');
    }
  });

  it('Should display an error message if Date Published is not in the past', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.visit(url);

    cy.waitForStableDOM();

    cy.get('input[name=date_published]').type('3000-01-01');

    cy.contains('button', 'Submit').click();

    cy.get('form').contains('*Date must be in the past').should('exist');

    cy.contains('Please review. Some data is missing.').should('exist');
  });

  it('Should display an error message if Date Downloaded is not in the past', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.visit(url);

    cy.waitForStableDOM();

    cy.get('input[name=date_downloaded]').type('3000-01-01');

    cy.contains('button', 'Submit').click();

    cy.get('form').contains('*Date must be in the past').should('exist');

    cy.contains('Please review. Some data is missing.').should('exist');
  });
});
