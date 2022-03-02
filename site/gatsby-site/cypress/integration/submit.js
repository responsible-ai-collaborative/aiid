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
      '**/functions/call',
      (req) => req.body.name == 'createReportForReview',
      'submitReport',
      {}
    );

    cy.get('button[type="submit"]').click();

    cy.wait('@submitReport').then((xhr) => {
      expect(xhr.request.body.arguments[0]).to.deep.include({
        title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
        submitters: 'Something',
        authors: ['Valentina Palladino'],
        incident_date: '2021-09-21',
        date_published: '2017-11-10',
        image_url:
          'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
        tags: ['New Tag'],
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

    // wait for gatsby to finish its scroll restoration stuff
    cy.wait(1000);

    cy.conditionalIntercept(
      '**/functions/call',
      (req) => req.body.name == 'createReportForReview',
      'submitReport',
      {}
    );

    cy.get('button[type="submit"]').scrollIntoView().click({ force: true });

    cy.wait('@submitReport').then((xhr) => {
      expect(xhr.request.body.arguments[0]).to.deep.include({
        ...values,
        incident_id: { $numberInt: values.incident_id },
        tags: [values.tags],
      });
    });
  });
});
