import parseNews from '../fixtures/api/parseNews.json';
import probablyRelatedIncidents from '../fixtures/incidents/probablyRelatedIncidents.json';
import probablyRelatedReports from '../fixtures/reports/probablyRelatedReports.json';

describe('The Submit form', () => {
  const url = '/apps/submit';

  const parserURL = '/api/parseNews**';

  it('Should submit a new report response', () => {
    const values = {
      url: 'https://incidentdatabase.ai',
      title: 'test title',
      authors: 'test author',
      submitters: 'test submitter',
      incident_date: '2022-01-01',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      image_url: 'https://incidentdatabase.ai/image.jpg',
      incident_ids: [1],
      text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
      tags: 'response',
      editor_notes: 'Here are some notes',
    };

    const params = new URLSearchParams(values);

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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentsTitles',
      'FindIncidentsTitles',
      {
        data: {
          incidents: [
            {
              __typename: 'Incident',
              incident_id: 1,
              title: 'Test title',
              date: '2022-01-01',
            },
          ],
        },
      }
    );

    cy.intercept('GET', parserURL, values).as('parseNews');

    cy.visit(url + `?${params.toString()}`);

    cy.wait('@parseNews');

    cy.get('[data-cy="submit-form-title"]').contains('New Incident Response').should('exist');

    cy.get('.form-has-errors').should('not.exist');

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-2"]').scrollIntoView().click();

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-3"]').click();

    cy.wait('@FindIncidentsTitles');

    cy.get('button[type="submit"]').scrollIntoView().click();

    cy.waitForStableDOM();

    cy.wait('@insertSubmission').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.nested.include({
        ...values,
        incident_ids: [1],
        authors: [values.authors],
        submitters: [values.submitters],
        tags: [values.tags],
        plain_text:
          'Sit quo accusantium\n\nquia assumenda. Quod delectus similique labore optio quaease\n',
        source_domain: `incidentdatabase.ai`,
        cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
        editor_notes: 'Here are some notes',
      });
    });
  });

  it('Should show related reports based on author', () => {
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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedIncidents',
      'ProbablyRelatedIncidents',
      probablyRelatedIncidents
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedReports',
      'ProbablyRelatedReports',
      probablyRelatedReports
    );

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.visit(url);

    const values = {
      url: 'https://incidentdatabase.ai',
      title: 'test title',
      authors: 'BBC News',
      incident_date: '2022-01-01',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
    };

    for (const key in values) {
      cy.get(`[name="${key}"]`).type(values[key]);
    }

    cy.setEditorText(
      'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease'
    );

    cy.clickOutside();

    cy.waitForStableDOM();

    cy.get('[data-cy="related-byAuthors"] [data-cy="result"]')
      .should('be.visible')
      .eq(0)
      .then(($el) => {
        cy.wrap($el).find('[data-cy="unspecified"]').eq(0).should('be.visible').click();
      });

    cy.get('[data-cy="related-byAuthors"] [data-cy="result"]')
      .should('be.visible')
      .eq(1)
      .then(($el) => {
        cy.wrap($el).find('[data-cy="dissimilar"]').eq(0).should('be.visible').click();
      });

    cy.get('[data-cy="related-byAuthors"] [data-cy="result"]')
      .should('be.visible')
      .eq(2)
      .then(($el) => {
        cy.wrap($el).find('[data-cy="similar"]').eq(0).should('be.visible').click();
      });

    cy.get('button[data-cy="submit-step-1"]').scrollIntoView().click();

    cy.wait('@insertSubmission', { timeout: 10000 }).then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.nested.include({
        ...values,
        authors: [values.authors],
        plain_text:
          'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease\n',
        source_domain: `incidentdatabase.ai`,
        editor_dissimilar_incidents: [2],
        editor_similar_incidents: [3],
      });
    });
  });

  it('Should *not* show related reports based on author', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    const valuesStep1 = {
      authors: 'test author',
    };

    for (const key in valuesStep1) {
      cy.get(`[name="${key}"]`).type(valuesStep1[key]);
    }

    cy.clickOutside();

    cy.get('[data-cy="related-byAuthors"] ')
      .should('be.visible')
      .should('contain', 'No related reports found.');
  });

  it('Should hide incident_date, description, deployers, developers & harmed_parties if incident_ids is set', () => {
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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentsTitles',
      'FindIncidentsTitles',
      {
        data: {
          incidents: [
            {
              __typename: 'Incident',
              incident_id: 1,
              title: 'Test title',
              date: '2016-03-13',
            },
          ],
        },
      }
    );

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.visit(url);

    const valuesStep1 = {
      url: 'https://incidentdatabase.ai',
      title: 'test title',
      authors: 'test author',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      incident_ids: '1',
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

    cy.setEditorText(
      'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease'
    );
    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('input[name="incident_date"]').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    const valuesStep2 = {
      submitters: 'test submitter',
      image_url: 'https://incidentdatabase.ai/image.jpg',
    };

    for (const key in valuesStep2) {
      cy.get(`[name="${key}"]`).type(valuesStep2[key]);
    }

    cy.get('[data-cy="to-step-3"]').click();

    const valuesStep3 = {
      editor_notes: 'Here are some notes',
    };

    for (const key in valuesStep3) {
      cy.get(`[name="${key}"]`).type(valuesStep3[key]);
    }

    cy.get('input[name="description"]').should('not.exist');
    cy.get('input[name="deployers"]').should('not.exist');
    cy.get('input[name="developers"]').should('not.exist');
    cy.get('input[name="harmed_parties"]').should('not.exist');

    cy.get('button[type="submit"]').click();

    cy.wait('@insertSubmission').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.nested.include({
        ...valuesStep1,
        ...valuesStep2,
        ...valuesStep3,
        incident_ids: [1],
        authors: [valuesStep1.authors],
        submitters: [valuesStep2.submitters],
        tags: [],
        plain_text:
          'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease\n',
        source_domain: `incidentdatabase.ai`,
        cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
        editor_notes: 'Here are some notes',
      });
    });

    cy.get('.tw-toast').contains('Report successfully added to review queue').should('be.visible');

    cy.get('.tw-toast a').should('have.attr', 'href', '/apps/submitted/');

    cy.contains('Please review. Some data is missing.').should('not.exist');
  });

  it('Should allow two submissions in a row', () => {
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
  });
});
