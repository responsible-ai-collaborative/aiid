import parseNews from '../../fixtures/api/parseNews.json';
import semanticallyRelated from '../../fixtures/api/semanticallyRelated.json';
import probablyRelatedIncidents from '../../fixtures/incidents/probablyRelatedIncidents.json';
import probablyRelatedReports from '../../fixtures/reports/probablyRelatedReports.json';

import { maybeIt } from '../../support/utils';

describe('The Submit form', () => {
  const url = '/apps/submit';

  const parserURL = '/api/parseNews**';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should submit a new report not linked to any incident once all fields are filled properly', () => {
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

    cy.visit(url);

    cy.get('input[name="url"]').type(
      `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
    );

    cy.get('button').contains('Fetch info').click();

    cy.wait('@parseNews');

    cy.get('[name="incident_date"]').type('2020-01-01');

    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    cy.get('input[name="submitters"]').type('Something');

    cy.get('[name="language"]').select('Spanish');

    cy.get('[data-cy="to-step-3"]').click();

    cy.get('[name="incident_title"]').should('not.exist');

    cy.get('[name="description"]').type('Description');

    cy.get('[name="incident_editors"]').should('not.exist');

    cy.get('[name="tags"]').type('New Tag{enter}');

    cy.get('[name="editor_notes"').type('Here are some notes');

    cy.get('button[type="submit"]').click();

    cy.wait('@insertSubmission').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.nested.include({
        title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
        submitters: ['Something'],
        authors: ['Valentina Palladino'],
        incident_date: '2020-01-01',
        date_published: '2017-11-10',
        image_url:
          'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
        tags: ['New Tag'],
        incident_id: 0,
        text: "## Recent news stories and blog\n\nposts _highlighted_ the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.",
        plain_text:
          "Recent news stories and blog\n\nposts highlighted the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.\n",
        url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
        source_domain: `arstechnica.com`,
        language: 'es',
        editor_notes: 'Here are some notes',
        description: 'Description',
      });
    });

    cy.get('div[class^="ToastContext"]')
      .contains('Report successfully added to review queue. You can see your submission')
      .should('exist');

    cy.contains('Please review. Some data is missing.').should('not.exist');
  });

  maybeIt(
    'As editor, should submit a new incident report, adding an incident title and editors.',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

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

      cy.visit(url);

      cy.get('input[name="url"]').type(
        `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
      );

      cy.get('button').contains('Fetch info').click();

      cy.wait('@parseNews');

      cy.get('[name="incident_date"]').type('2020-01-01');

      cy.clickOutside();

      cy.get('.form-has-errors').should('not.exist');

      cy.get('[data-cy="to-step-2"]').click();

      cy.get('input[name="submitters"]').type('Something');

      cy.get('[name="language"]').select('Spanish');

      cy.get('[data-cy="to-step-3"]').click();

      cy.get('[name="incident_title"]').type('Elsagate');

      cy.get('[name="description"]').type('Description');

      cy.get('[name="incident_editors"]').type('Sean McGregor, Khoa Lam');

      cy.get('[name="tags"]').type('New Tag{enter}');

      cy.get('[name="editor_notes"').type('Here are some notes');

      cy.get('button[type="submit"]').click();

      cy.wait('@insertSubmission').then((xhr) => {
        expect(xhr.request.body.variables.submission).to.deep.nested.include({
          title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
          submitters: ['Something'],
          authors: ['Valentina Palladino'],
          incident_date: '2020-01-01',
          incident_editors: ['Sean McGregor', 'Khoa Lam'],
          incident_title: 'Elsagate',
          date_published: '2017-11-10',
          image_url:
            'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
          tags: ['New Tag'],
          incident_id: 0,
          text: "## Recent news stories and blog\n\nposts _highlighted_ the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.",
          plain_text:
            "Recent news stories and blog\n\nposts highlighted the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.\n",
          url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
          source_domain: `arstechnica.com`,
          language: 'es',
          editor_notes: 'Here are some notes',
          description: 'Description',
        });
      });

      cy.get('div[class^="ToastContext"]')
        .contains('Report successfully added to review queue')
        .should('be.visible');

      cy.get('div[class^="ToastContext"] a').should('have.attr', 'href', '/apps/submitted/');

      cy.contains('Please review. Some data is missing.').should('not.exist');
    }
  );

  it('Should submit a new report linked to incident 1 once all fields are filled properly', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'FindIncident' && req.body.variables.query.incident_id == 1,
      'findIncident',
      {
        data: {
          incident: {
            __typename: 'Incident',
            incident_id: 1,
            title: 'Test title',
            date: '2016-03-13',
          },
        },
      }
    );

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
      (req) => req.body.operationName == 'FindSubmissions',
      'findSubmissions',
      {
        data: {
          submissions: [
            {
              __typename: 'Submission',
              _id: '6272f2218933c7a9b512e13b',
              text: 'Something',
              title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
              submitters: ['Something'],
              authors: ['Valentina Palladino'],
              incident_date: '2021-09-21',
              date_published: '2017-11-10',
              image_url:
                'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
              tags: ['New Tag'],
              incident_id: '0',
              url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
              source_domain: 'arstechnica.com',
              language: 'en',
              description: 'Something',
              editor_notes: 'Here are some notes',
            },
          ],
        },
      }
    );

    cy.intercept('POST', '/api/semanticallyRelated', semanticallyRelated).as('semanticallyRelated');

    cy.visit(url);

    cy.get('input[name="url"]').type(
      `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
    );

    cy.get('button').contains('Fetch info').click();

    cy.setEditorText(
      `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube. While all content on YouTube Kids is meant to be suitable for children under the age of 13, some inappropriate videos using animations, cartoons, and child-focused keywords manage to get past YouTube's algorithms and in front of kids' eyes. Now, YouTube will implement a new policy in an attempt to make the whole of YouTube safer: it will age-restrict inappropriate videos masquerading as children's content in the main YouTube app.`
    );

    // Set the ID from the button in the list of semantically similar incidents
    cy.get('[data-cy=related-byText] [data-cy=result] [data-cy=set-id]', { timeout: 8000 })
      .contains('#1')
      .first()
      .click();

    cy.get(
      '[data-cy=related-byText] [data-cy=result] [data-cy="similar-selector"] [data-cy="similar"]'
    )
      .last()
      .click();

    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    cy.wait('@findIncident');

    cy.get('[data-cy="to-step-3"]').click();

    cy.get('[name="incident_title"]').should('not.exist');

    cy.get('[name="description"]').should('not.exist');

    cy.get('[name="incident_editors"]').should('not.exist');

    cy.get('[name="tags"]').type('New Tag{enter}');

    cy.get('[name="editor_notes"').type('Here are some notes');

    cy.get('button[type="submit"]').click();

    cy.wait('@insertSubmission').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.include({
        title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
        submitters: ['Anonymous'],
        authors: ['Valentina Palladino'],
        date_published: '2017-11-10',
        image_url:
          'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
        cloudinary_id:
          'reports/cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
        tags: ['New Tag'],
        incident_id: 1,
        url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
        source_domain: `arstechnica.com`,
        editor_notes: 'Here are some notes',
      });
      expect(xhr.request.body.variables.submission.editor_similar_incidents.length == 1).to.be.true;
    });

    cy.contains('Report successfully added to review queue').should('exist');

    cy.visit('/apps/submitted');

    cy.wait('@findSubmissions');

    cy.contains(
      '[data-cy="submission"]',
      'YouTube to crack down on inappropriate content masked as kids’ cartoons'
    ).should('exist');
    cy.get('[data-cy="submission"] [data-cy="review-button"]').click();

    const expectedValues = {
      _id: '6272f2218933c7a9b512e13b',
      text: 'Something',
      submitters: 'Something',
      authors: 'Valentina Palladino',
      incident_date: '2021-09-21',
      date_published: '2017-11-10',
      image_url:
        'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
      incident_id: '0',
      url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
      source_domain: 'arstechnica.com',
      language: 'en',
      editor_notes: 'Here are some notes',
    };

    for (let key in expectedValues) {
      cy.get(`[data-cy="${key}"]`).contains(expectedValues[key]).should('exist');
    }

    cy.contains('Please review. Some data is missing.').should('not.exist');
  });

  it('Should show a toast on error when failing to reach parsing endpoint', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, { ...parseNews, forceNetworkError: true }).as('parseNews');

    cy.get('input[name="url"]').type(
      `https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas/`
    );

    cy.get('button').contains('Fetch info').click();

    cy.wait('@parseNews');

    cy.get('div[class^="ToastContext"]')
      .contains('Error reaching news info endpoint, please try again in a few seconds.')
      .should('exist');
  });

  it.skip('Should pull parameters form the query string and auto-fill fields', () => {
    const values = {
      url: 'https://test.com',
      title: 'test title',
      authors: 'test author',
      submitters: 'test submitter',
      incident_date: '2022-01-01',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      image_url: 'https://test.com/image.jpg',
      incident_id: '1',
      text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
      tags: 'test tag',
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
      (req) =>
        req.body.operationName == 'FindIncident' && req.body.variables.query.incident_id == 1,
      'findIncident',
      {
        data: {
          incident: {
            __typename: 'Incident',
            incident_id: 1,
            title: 'Test title',
            date: '2022-01-01',
          },
        },
      }
    );

    cy.visit(url + `?${params.toString()}`);

    cy.waitForStableDOM();

    cy.get('.form-has-errors').should('not.exist');

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-2"]').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-3"]').click();

    cy.wait('@findIncident');

    cy.waitForStableDOM();

    cy.get('button[type="submit"]').click();

    cy.wait('@insertSubmission').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.nested.include({
        ...values,
        incident_id: '1',
        authors: [values.authors],
        submitters: [values.submitters],
        tags: [values.tags],
        plain_text:
          'Sit quo accusantium\n\nquia assumenda. Quod delectus similique labore optio quaease\n',
        source_domain: `test.com`,
        cloudinary_id: `reports/test.com/image.jpg`,
        editor_notes: 'Here are some notes',
      });
    });
  });

  it.skip('Should show a list of related reports', () => {
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
              report_number: 1397,
              title: 'Job Screening Service Halts Facial Analysis of Applicants',
              url: 'https://www.wired.com/story/job-screening-service-halts-facial-analysis-applicants/',
            },
            {
              __typename: 'Report',
              report_number: 1473,
              title:
                'Italian court rules against ‘discriminatory’ Deliveroo rider-ranking algorithm',
              url: 'https://techcrunch.com/2021/01/04/italian-court-rules-against-discriminatory-deliveroo-rider-ranking-algorithm/',
            },
            {
              __typename: 'Report',
              report_number: 1467,
              title: 'Facial Recognition Blamed For False Arrest And Jail Time',
              url: 'https://www.silicon.co.uk/e-regulation/facial-recognition-false-arrest-349782',
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
              reports: [
                {
                  __typename: 'Report',
                  report_number: 10,
                  title: 'Remove YouTube Kids app until it eliminates its inappropriate content',
                  url: 'https://www.change.org/p/remove-youtube-kids-app-until-it-eliminates-its-inappropriate-content',
                },
                {
                  __typename: 'Report',
                  report_number: 6,
                  title: 'What parents should know about inappropriate content on YouTube',
                  url: 'https://www.goodmorningamerica.com/family/story/parents-inappropriate-content-youtube-54993637',
                },
                {
                  __typename: 'Report',
                  report_number: 14,
                  title: 'YouTube Kids Is Nowhere Near as Innocent As It Seems',
                  url: 'https://studybreaks.com/tvfilm/youtube-kids-isnt-innocent-seems/',
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

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'ProbablyRelatedIncidents' &&
        req.body.variables.query?.incident_id_in?.[0] == 1,
      'RelatedReportsByIncidentId',
      relatedReports.byIncidentId
    );

    cy.visit(url);

    const values = {
      url: 'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
      authors: 'test author',
      date_published: '2021-01-02',
      incident_id: '1',
    };

    for (const key in values) {
      cy.get(`input[name="${key}"]`).type(values[key]);
    }

    cy.wait([
      '@RelatedReportsByURL',
      '@RelatedReportsByPublishedDate',
      '@RelatedReportsByAuthor',
      '@RelatedReportsByIncidentId',
    ]);

    for (const key of ['byURL', 'byDatePublished', 'byIncidentId']) {
      const reports =
        key == 'byIncidentId'
          ? relatedReports[key].data.incidents[0].reports
          : relatedReports[key].data.reports;

      cy.get(`[data-cy="related-${key}"]`).within(() => {
        cy.get('[class="list-group-item"]').should('have.length', reports.length, 'bue');

        for (const report of reports) {
          cy.contains('[class="list-group-item"]', report.title).should('be.visible');
        }
      });
    }

    cy.get(`[data-cy="related-byAuthors"]`).within(() => {
      cy.get('.list-group-item').should('contain.text', 'No related reports found.');
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

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'ProbablyRelatedIncidents' &&
        req.body.variables.query?.incident_id_in?.[0] == 1,
      'RelatedReportsByIncidentId',
      relatedReports.byIncidentId
    );

    const values = {
      url: 'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
      authors: 'test author',
      date_published: '2021-01-02',
      incident_id: '1',
    };

    cy.visit(url);

    for (const key in values) {
      cy.get(`input[name="${key}"]`).type(values[key]);
    }

    cy.wait([
      '@RelatedReportsByURL',
      '@RelatedReportsByPublishedDate',
      '@RelatedReportsByAuthor',
      '@RelatedReportsByIncidentId',
    ]);

    cy.get('[data-cy="empty-message"]').should('be.visible');

    cy.get('[data-cy="related-reports"]').should('not.exist');
  });

  // cy.setEditorText doesn't seem to trigger a render of the relateBbyText component
  it.skip('Should show related reports based on semantic similarity', () => {
    cy.visit(url);
    cy.setEditorText(
      `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube. While all content on YouTube Kids is meant to be suitable for children under the age of 13, some inappropriate videos using animations, cartoons, and child-focused keywords manage to get past YouTube's algorithms and in front of kids' eyes. Now, YouTube will implement a new policy in an attempt to make the whole of YouTube safer: it will age-restrict inappropriate videos masquerading as children's content in the main YouTube app.`
    );

    cy.get('[data-cy=related-byText] [data-cy=result] a[data-cy=title]').should(
      'contain',
      'YouTube'
    );
    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();
  });

  // cy.setEditorText doesn't seem to trigger a render of the relateBbyText component
  it.skip('Should *not* show semantically related reports when the text is under 256 non-space characters', () => {
    cy.visit(url);

    cy.setEditorText(
      `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube.`
    );

    cy.get('[data-cy=related-byText]').contains('Reports must have at least').should('exist');
  });

  it('Should show fallback preview image on initial load', () => {
    const values = {
      url: 'https://test.com',
      title: 'test title',
      authors: 'test author',
      submitters: 'test submitter',
      incident_date: '2022-01-01',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      incident_id: '1',
    };

    const params = new URLSearchParams(values);

    cy.intercept('GET', parserURL, values).as('parseNews');

    cy.visit(url + `?${params.toString()}`);

    cy.wait('@parseNews');

    cy.setEditorText(
      `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube. While all content on YouTube Kids is meant to be suitable for children under the age of 13, some inappropriate videos using animations, cartoons, and child-focused keywords manage to get past YouTube's algorithms and in front of kids' eyes. Now, YouTube will implement a new policy in an attempt to make the whole of YouTube safer: it will age-restrict inappropriate videos masquerading as children's content in the main YouTube app.`
    );

    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    cy.get('[data-cy="image-preview-figure"] canvas').should('exist');
  });

  it('Should update preview image when url is typed', () => {
    const values = {
      url: 'https://test.com',
      title: 'test title',
      authors: 'test author',
      submitters: 'test submitter',
      incident_date: '2022-01-01',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      incident_id: '1',
    };

    const params = new URLSearchParams(values);

    cy.intercept('GET', parserURL, values).as('parseNews');

    cy.visit(url + `?${params.toString()}`);

    cy.wait('@parseNews');

    const suffix = 'github.com/favicon.ico';

    const newImageUrl = 'https://' + suffix;

    const cloudinaryImageUrl =
      'https://res.cloudinary.com/pai/image/upload/f_auto/q_auto/v1/reports/' + suffix;

    cy.setEditorText(
      `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube. While all content on YouTube Kids is meant to be suitable for children under the age of 13, some inappropriate videos using animations, cartoons, and child-focused keywords manage to get past YouTube's algorithms and in front of kids' eyes. Now, YouTube will implement a new policy in an attempt to make the whole of YouTube safer: it will age-restrict inappropriate videos masquerading as children's content in the main YouTube app.`
    );

    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    cy.get('input[name=image_url]').scrollIntoView().type(newImageUrl);

    cy.get('[data-cy=image-preview-figure] img', { timeout: 30000 })
      .scrollIntoView()
      .should('have.attr', 'src', cloudinaryImageUrl);
  });

  it("Should not submit form when linking to an Incident that doesn't exist", () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'FindIncident' && req.body.variables.query.incident_id == 3456456,
      'findIncident',
      { data: { incident: null } }
    );

    cy.visit(url);

    const valuesStep1 = {
      url: 'https://test.com',
      title: 'test title',
      authors: 'test author',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      incident_date: '2022-01-01',
      incident_id: '3456456',
    };

    for (const key in valuesStep1) {
      cy.get(`[name="${key}"]`).type(valuesStep1[key]);
    }

    cy.setEditorText(
      'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease'
    );

    cy.get('[name="incident_date"]').should('not.exist');

    cy.wait('@findIncident');

    cy.contains('.invalid-feedback', 'Incident ID 3456456 not found!').should('be.visible');
  });

  it('Should show the editor notes field', () => {
    cy.visit(url);

    const valuesStep1 = {
      url: 'https://test.com',
      title: 'test title',
      authors: 'test author',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      incident_date: '2022-01-01',
    };

    for (const key in valuesStep1) {
      cy.get(`[name="${key}"]`).type(valuesStep1[key]);
    }

    cy.setEditorText(
      'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease'
    );
    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    const valuesStep2 = {
      submitters: 'test submitter',
      image_url: 'https://test.com/image.jpg',
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

    cy.get('[name="editor_notes"').should('exist');
  });

  it('Should show a popover', () => {
    cy.visit(url);

    cy.get('[data-cy="label-title"]').trigger('mouseover');

    cy.get('[data-cy="popover-title"]').should('be.visible');

    cy.get('[data-cy="popover-title"]').contains('h5', 'Headline').should('exist');

    cy.get('[data-cy="popover-title"]').contains('div', 'Most works have a title').should('exist');
  });

  it('Should show a translated popover', () => {
    cy.visit(`/es/apps/submit/`);

    cy.get('[data-cy="label-title"]').trigger('mouseover');

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

    cy.get('div[class^="ToastContext"]')
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

    cy.get('div[class^="ToastContext"]')
      .contains('Report successfully added to review queue. You can see your submission')
      .should('exist');
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

    cy.get('div[class^="ToastContext"]')
      .contains('Report successfully added to review queue. You can see your submission')
      .should('exist');
  });

  it('Should display an error message if data is missing', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'FindIncident' && req.body.variables.query.incident_id == 3456456,
      'findIncident',
      { data: { incident: null } }
    );

    cy.visit(url);

    cy.contains('button', 'Submit').click();

    cy.contains('Please review. Some data is missing.').should('exist');
  });

  it.skip('Should submit a new report response', () => {
    const values = {
      url: 'https://test.com',
      title: 'test title',
      authors: 'test author',
      submitters: 'test submitter',
      incident_date: '2022-01-01',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      image_url: 'https://test.com/image.jpg',
      incident_id: '1',
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
      (req) =>
        req.body.operationName == 'FindIncident' && req.body.variables.query.incident_id == 1,
      'findIncident',
      {
        data: {
          incident: {
            __typename: 'Incident',
            incident_id: 1,
            title: 'Test title',
            date: '2022-01-01',
          },
        },
      }
    );

    cy.visit(url + `?${params.toString()}`);

    cy.get('[data-cy="submit-form-title"]').contains('New Incident Response').should('exist');

    cy.get('.form-has-errors').should('not.exist');

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-2"]').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="to-step-3"]').click();

    cy.wait('@findIncident');

    cy.get('button[type="submit"]').scrollIntoView().click();

    cy.waitForStableDOM();

    cy.wait('@insertSubmission').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.nested.include({
        ...values,
        incident_id: '1',
        authors: [values.authors],
        submitters: [values.submitters],
        tags: [values.tags],
        plain_text:
          'Sit quo accusantium\n\nquia assumenda. Quod delectus similique labore optio quaease\n',
        source_domain: `test.com`,
        cloudinary_id: `reports/test.com/image.jpg`,
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

    cy.visit(url);

    const values = {
      url: 'https://test.com',
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
        source_domain: `test.com`,
        editor_dissimilar_incidents: [2],
        editor_similar_incidents: [3],
      });
    });
  });

  it('Should *not* show related reports based on author', () => {
    cy.visit(url);

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

  it('Should hide incident_date, description, deployers, developers & harmed_parties if incident_id', () => {
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

    cy.visit(url);

    const valuesStep1 = {
      url: 'https://test.com',
      title: 'test title',
      authors: 'test author',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      incident_date: '2022-01-01',
      incident_id: '1',
    };

    for (const key in valuesStep1) {
      cy.get(`[name="${key}"]`).type(valuesStep1[key]);
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
      image_url: 'https://test.com/image.jpg',
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
        incident_id: 1,
        authors: [valuesStep1.authors],
        submitters: [valuesStep2.submitters],
        tags: [],
        plain_text:
          'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease\n',
        source_domain: `test.com`,
        cloudinary_id: `reports/test.com/image.jpg`,
        editor_notes: 'Here are some notes',
      });
    });

    cy.get('div[class^="ToastContext"]')
      .contains('Report successfully added to review queue')
      .should('be.visible');

    cy.get('div[class^="ToastContext"] a').should('have.attr', 'href', '/apps/submitted/');

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

    cy.get('div[class^="ToastContext"]')
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

    cy.get('div[class^="ToastContext"]')
      .contains('Report successfully added to review queue. You can see your submission')
      .should('exist');
  });

  it('Should fetch the news if the url param is in the querystring', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.intercept('GET', parserURL, cy.spy().as('parseNewsSpy'));

    cy.visit(
      `${url}?url=https%3A%2F%2Fwww.arstechnica.com%2Fgadgets%2F2017%2F11%2Fyoutube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons%2F`
    );

    cy.wait('@parseNews');

    cy.get('div[class^="ToastContext"]')
      .contains('Please verify all information programmatically pulled from the report')
      .should('exist');

    cy.get('input[name="url"]').type(`https://skylightcyber.com/2019/07/18/cylance-i-kill-you/`);

    cy.get('@parseNewsSpy').should('have.been.calledOnce');
  });
});
