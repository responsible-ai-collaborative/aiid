import parseNews from '../fixtures/api/parseNews.json';

describe('The Submit form', () => {
  const url = '/apps/submit';

  const parserURL = '/api/parseNews**';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should submit a new report not linked to any incident once all fields are filled properly', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.get('input[name="url"]').type(
      `https://arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
    );

    cy.get('button').contains('Fetch info').click();

    cy.wait('@parseNews');

    cy.get('input[name="submitters"]').type('Something');

    cy.get('[class*="Typeahead"]').type('New Tag{enter}');

    cy.get('[name="incident_date"]').type('2020-01-01');

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
        incident_date: '2020-01-01',
        date_published: '2017-11-10',
        image_url:
          'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
        tags: ['New Tag'],
        incident_id: 0,
        url: `https://arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
        source_domain: `arstechnica.com`,
        language: 'en',
      });
    });

    cy.get('div[class^="ToastContext"]')
      .contains('Report successfully added to review queue')
      .should('exist');
  });

  it('Should submit a new report linked to incident 1 once all fields are filled properly', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.visit(url);

    cy.get('input[name="url"]').type(
      `https://arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
    );

    cy.get('button').contains('Fetch info').click();

    cy.get('input[name="submitters"]').type('Something');

    cy.get('[class*="Typeahead"]').type('New Tag{enter}');

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

    cy.get('[name="incident_id"]').type('1');

    cy.wait('@findIncident');

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
        date_published: '2017-11-10',
        image_url:
          'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
        tags: ['New Tag'],
        incident_id: 1,
        url: `https://arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
        source_domain: `arstechnica.com`,
      });
    });

    cy.get('div[class^="ToastContext"]')
      .contains('Report successfully added to review queue')
      .should('exist');

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
              url: `https://arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
              source_domain: 'arstechinca.com',
              language: 'en',
              description: 'Something',
            },
          ],
        },
      }
    );

    cy.visit('/apps/submitted');

    cy.wait('@findSubmissions');

    cy.contains(
      '[data-cy="submission"]',
      'YouTube to crack down on inappropriate content masked as kids’ cartoons'
    ).should('exist');
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

    cy.wait('@findIncident');

    cy.get('button[type="submit"]').scrollIntoView().click();

    cy.wait('@submitReport').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.include({
        ...values,
        incident_id: '1',
        authors: [values.authors],
        submitters: [values.submitters],
        tags: [values.tags],
        source_domain: `test.com`,
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

  it('Should show fallback preview image on initial load', () => {
    const imageUrl =
      'https://res.cloudinary.com/pai/image/upload/d_fallback.jpg/f_auto/q_auto/fallback.jpg';

    cy.visit(url);
    cy.get('[data-cy="image-preview-figure"] img').should('have.attr', 'src', imageUrl);
  });

  it('Should update preview image when url is typed', () => {
    const suffix = 'github.com/favicon.ico';

    const newImageUrl = 'https://' + suffix;

    const cloudinaryImageUrl =
      'https://res.cloudinary.com/pai/image/upload/d_fallback.jpg/f_auto/q_auto/v1/reports/' +
      suffix;

    cy.visit(url);
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

    const values = {
      url: 'https://test.com',
      title: 'test title',
      authors: 'test author',
      submitters: 'test submitter',
      incident_date: '2022-01-01',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      image_url: 'https://test.com/image.jpg',
      incident_id: '3456456',
      text: 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease',
    };

    for (const key in values) {
      cy.get(`[name="${key}"]`).type(values[key]);
    }

    cy.wait('@findIncident');

    cy.get('[name="incident_date"]').should('not.exist');

    cy.contains('.invalid-feedback', 'Incident ID 3456456 not found!').should('be.visible');
  });

  it('Should require incident_date when incident_id is not set', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'FindIncident' && req.body.variables.query.incident_id == 3456456,
      'findIncident',
      { data: { incident: null } }
    );

    cy.visit(url);

    const values = {
      url: 'https://test.com',
      title: 'test title',
      authors: 'test author',
      submitters: 'test submitter',
      date_published: '2021-01-02',
      date_downloaded: '2021-01-03',
      image_url: 'https://test.com/image.jpg',
      text: 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease',
    };

    for (const key in values) {
      cy.get(`[name="${key}"]`).type(values[key]);
    }

    cy.get('[name="incident_date"]').should('be.visible');

    cy.contains('button', 'Submit').click();

    cy.contains('.invalid-feedback', '*Incident Date required').should('be.visible');
  });
});
