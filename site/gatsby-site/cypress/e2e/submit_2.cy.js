import parseNews from '../fixtures/api/parseNews.json';
import { maybeIt } from '../support/utils';

describe('The Submit form', () => {
  const url = '/apps/submit';

  const parserURL = '/api/parseNews**';

  it('Should show a toast on error when failing to reach parsing endpoint', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, { ...parseNews, forceNetworkError: true }).as('parseNews');

    cy.get('input[name="url"]').type(
      `https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas/`
    );

    cy.get('button').contains('Fetch info').click();

    cy.wait('@parseNews');

    cy.get('.tw-toast')
      .contains('Error reaching news info endpoint, please try again in a few seconds.')
      .should('exist');
  });

  it('Should pull parameters form the query string and auto-fill fields', () => {
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
      tags: 'test tag',
      editor_notes: 'Here are some notes',
    };

    const params = new URLSearchParams(values);

    cy.intercept('GET', parserURL, {
      title: 'test title',
      authors: 'test author',
      submitters: 'test submitter',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      incident_date: '2022-01-01',
      incident_ids: [1],
      image_url: 'https://incidentdatabase.ai/image.jpg',
      text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
      tags: 'test tag',
      editor_notes: 'Here are some notes',
    }).as('parseNews');

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

    cy.visit(url + `?${params.toString()}`);

    cy.wait('@FindIncidentsTitles');

    cy.get('.form-has-errors').should('not.exist');

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-2"]').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-3"]').click();

    cy.waitForStableDOM();

    cy.get('button[type="submit"]').click();

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

      expect(xhr.request.body.variables.submission.user).to.be.undefined;
    });
  });

  maybeIt('Should submit a submission and link it to the current user id', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const values = {
      url: 'https://incidentdatabase.ai',
      title: 'test title',
      authors: 'test author',
      incident_date: '2022-01-01',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      image_url: 'https://incidentdatabase.ai/image.jpg',
      incident_ids: [1],
      text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
      tags: 'test tag',
      editor_notes: 'Here are some notes',
    };

    const params = new URLSearchParams(values);

    cy.intercept('GET', parserURL, {
      title: 'test title',
      authors: 'test author',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      image_url: 'https://incidentdatabase.ai/image.jpg',
      text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
    }).as('parseNews');

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

    cy.visit(url + `?${params.toString()}`);

    cy.wait('@FindIncidentsTitles');

    cy.get('.form-has-errors').should('not.exist');

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-2"]').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-3"]').click();

    cy.waitForStableDOM();

    cy.get('button[type="submit"]').click();

    cy.wait('@insertSubmission').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.nested.include({
        ...values,
        incident_ids: [1],
        authors: [values.authors],
        submitters: ['Test User'],
        tags: [values.tags],
        plain_text:
          'Sit quo accusantium\n\nquia assumenda. Quod delectus similique labore optio quaease\n',
        source_domain: `incidentdatabase.ai`,
        cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
        editor_notes: 'Here are some notes',
      });

      expect(xhr.request.body.variables.submission.user.link).to.not.be.undefined;
    });
  });

  it('Should show a list of related reports', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    const relatedReports = {
      byURL: {
        data: {
          reports: [
            {
              __typename: 'Report',
              report_number: 1501,
              title: 'Zillow to exit its home buying business, cut 25% of staff',
              url: 'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
            },
          ],
        },
      },

      byDatePublished: {
        data: {
          reports: [
            {
              __typename: 'Report',
              report_number: 810,
              title:
                "Google's Nest Stops Selling Its Smart Smoke Alarm For Now Due To Faulty Feature",
              url: 'https://www.forbes.com/sites/aarontilley/2014/04/03/googles-nest-stops-selling-its-smart-smoke-alarm-for-now',
            },
            {
              __typename: 'Report',
              report_number: 811,
              title: 'Why Nest’s Smoke Detector Fail Is Actually A Win For Everyone',
              url: 'https://readwrite.com/2014/04/04/nest-smoke-detector-fail/',
            },
          ],
        },
      },

      byAuthors: {
        data: { reports: [] },
      },

      byIncidentId: {
        data: {
          incidents: [
            {
              __typename: 'Incident',
              incident_id: 1,
              title: 'Google’s YouTube Kids App Presents Inappropriate Content',
              reports: [
                {
                  __typename: 'Report',
                  report_number: 10,
                  title: 'Google’s YouTube Kids App Presents Inappropriate Content',
                  url: 'https://www.change.org/p/remove-youtube-kids-app-until-it-eliminates-its-inappropriate-content',
                },
              ],
            },
          ],
        },
      },
    };

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'ProbablyRelatedReports' &&
        req.body.variables.query?.url_in?.[0] ==
          'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
      'RelatedReportsByURL',
      relatedReports.byURL
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'ProbablyRelatedReports' &&
        req.body.variables.query?.epoch_date_published_gt == 1608346800 &&
        req.body.variables.query?.epoch_date_published_lt == 1610766000,
      'RelatedReportsByPublishedDate',
      relatedReports.byDatePublished
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'ProbablyRelatedReports' &&
        req.body.variables.query?.authors_in?.[0] == 'test author',
      'RelatedReportsByAuthor',
      relatedReports.byAuthors
    );

    cy.visit(url);

    cy.waitForStableDOM();

    const values = {
      url: 'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
      authors: 'test author',
      date_published: '2014-03-30',
      incident_ids: 1,
    };

    for (const key in values) {
      if (key == 'incident_ids') {
        cy.get(`input[name="${key}"]`).type(values[key]);

        cy.waitForStableDOM();

        cy.get(`[role="option"]`).first().click();
      } else {
        cy.get(`input[name="${key}"]`).type(values[key]);
      }
    }

    cy.wait(['@RelatedReportsByAuthor']);

    cy.waitForStableDOM();

    for (const key of ['byURL', 'byDatePublished']) {
      const reports =
        key == 'byIncidentId'
          ? relatedReports[key].data.incidents[0].reports
          : relatedReports[key].data.reports;

      cy.get(`[data-cy="related-${key}"]`).within(() => {
        cy.get('[data-cy="result"]').should('have.length', reports.length);

        for (const report of reports) {
          cy.contains('[data-cy="result"]', report.title, { timeout: 10000 }).should('be.visible');
        }
      });
    }

    cy.get(`[data-cy="related-byAuthors"]`).within(() => {
      cy.get('[data-cy="no-related-reports"]').should('contain.text', 'No related reports found.');
    });
  });

  it.skip('Should show a preliminary checks message', () => {
    const relatedReports = {
      byURL: {
        data: {
          reports: [],
        },
      },

      byDatePublished: {
        data: {
          reports: [],
        },
      },

      byAuthors: {
        data: { reports: [] },
      },

      byIncidentId: {
        data: {
          incidents: [],
        },
      },
    };

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'ProbablyRelatedReports' &&
        req.body.variables.query?.url_in?.[0] ==
          'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
      'RelatedReportsByURL',
      relatedReports.byURL
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'ProbablyRelatedReports' &&
        req.body.variables.query?.epoch_date_published_gt == 1608346800 &&
        req.body.variables.query?.epoch_date_published_lt == 1610766000,
      'RelatedReportsByPublishedDate',
      relatedReports.byDatePublished
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'ProbablyRelatedReports' &&
        req.body.variables.query?.authors_in?.[0] == 'test author',
      'RelatedReportsByAuthor',
      relatedReports.byAuthors
    );

    const values = {
      url: 'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
      authors: 'test author',
      date_published: '2021-01-02',
      incident_ids: '1',
    };

    cy.visit(url);

    for (const key in values) {
      if (key == 'incident_ids') {
        cy.get(`input[name="${key}"]`).type(values[key]);

        cy.waitForStableDOM();

        cy.get(`[role="option"]`).first().click();
      } else {
        cy.get(`input[name="${key}"]`).type(values[key]);
      }
    }

    cy.wait(['@RelatedReportsByAuthor', '@RelatedReportsByURL', '@RelatedReportsByPublishedDate'], {
      timeout: 30000,
    });

    cy.get('[data-cy="no-related-reports"]').should('be.visible');

    cy.waitForStableDOM();

    cy.get('[data-cy="result"]').should('not.exist');
  });

  // cy.setEditorText doesn't seem to trigger a render of the relateBbyText component
  it('Should show related reports based on semantic similarity', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.setEditorText(
      `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube. While all content on YouTube Kids is meant to be suitable for children under the age of 13, some inappropriate videos using animations, cartoons, and child-focused keywords manage to get past YouTube's algorithms and in front of kids' eyes. Now, YouTube will implement a new policy in an attempt to make the whole of YouTube safer: it will age-restrict inappropriate videos masquerading as children's content in the main YouTube app.`
    );

    cy.clickOutside();

    cy.get('[data-cy=related-byText] [data-cy=result] a[data-cy=title]', { timeout: 20000 }).should(
      'contain',
      'YouTube'
    );
    cy.clickOutside();
  });
});
