describe('The Submit form', () => {
  const url = '/apps/submit';

  const parserURL = '/api/parseNews**';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should submit a new report once all fields are filled properly', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL).as('parseNews');

    cy.get('input[name="url"]').type(
      `https://arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
    );

    cy.get('button').contains('Fetch info').click();

    cy.wait('@parseNews', { timeout: 30000 });

    cy.get('input[name="submitters"]').type('Something');

    cy.get('input[name="incident_date"]').type('2021-09-21');

    cy.get('[class*="Typeahead"]').type('New Tag');

    cy.get('a[aria-label="New Tag"]').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertSubmission',
      'submitReport',
      {
        data: {
          insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
        },
      }
    );

    cy.get('button[type="submit"]').click();

    cy.wait('@submitReport').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.include({
        title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
        submitters: ['Something'],
        authors: ['Valentina Palladino'],
        incident_date: '2021-09-21',
        date_published: '2017-11-10',
        image_url:
          'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
        tags: ['New Tag'],
        incident_id: '0',
      });
    });

    cy.get('div[class^="ToastContext"]')
      .contains('Report successfully added to review queue')
      .should('exist');
  });

  it('Should show a toast on error when failing to reach parsing endpoint', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, { forceNetworkError: true }).as('parseNews');

    cy.get('input[name="url"]').type(
      `https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas/`
    );

    cy.get('button').contains('Fetch info').click();

    cy.wait('@parseNews', { timeout: 30000 });

    cy.get('div[class^="ToastContext"]')
      .contains('Error reaching news info endpoint, please try again in a few seconds.')
      .should('exist');
  });

  it('Should pull parameters form the query string and auto-fill fields', () => {
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
      text: 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease',
      tags: 'test tag',
    };

    const params = new URLSearchParams(values);

    cy.visit(url + `?${params.toString()}`);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertSubmission',
      'submitReport',
      {
        data: {
          insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
        },
      }
    );

    cy.get('button[type="submit"]', { timeout: 8000 }).scrollIntoView().click({ force: true });

    cy.wait('@submitReport').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.include({
        ...values,
        incident_id: 1,
        authors: [values.authors],
        submitters: [values.submitters],
        tags: [values.tags],
      });
    });
  });

  it('Should show a list of related reports', () => {
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
        req.body.variables.query?.url_in[0] ==
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
    ]).then(() => {
      for (const key of ['byURL', 'byDatePublished', 'byIncidentId']) {
        const reports =
          key == 'byIncidentId'
            ? relatedReports[key].data.incidents[0].reports
            : relatedReports[key].data.reports;

        cy.get(`[data-cy="related-${key}"]`).within(() => {
          cy.get('[class="list-group-item"]').should('have.length', reports.length);

          for (const report of reports) {
            cy.contains('[class="list-group-item"]', report.title).should('be.visible');
          }
        });
      }

      cy.get(`[data-cy="related-byAuthors"]`).within(() => {
        cy.get('.list-group-item').should('contain.text', 'No related reports found.');
      });
    });
  });

  it('Should show a preliminary checks message', () => {
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
        req.body.variables.query?.url_in[0] ==
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

    cy.wait([
      '@RelatedReportsByURL',
      '@RelatedReportsByPublishedDate',
      '@RelatedReportsByAuthor',
      '@RelatedReportsByIncidentId',
    ]);

    cy.get('[data-cy="empty-message"]').should('be.visible');

    cy.get('[data-cy="related-reports"]').should('not.exist');
  });
});
