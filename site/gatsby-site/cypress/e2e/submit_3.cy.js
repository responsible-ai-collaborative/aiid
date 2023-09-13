import parseNews from '../fixtures/api/parseNews.json';

describe('The Submit form', () => {
  const url = '/apps/submit';

  const parserURL = '/api/parseNews**';

  // cy.setEditorText doesn't seem to trigger a render of the relateBbyText component
  it('Should *not* show semantically related reports when the text is under 256 non-space characters', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.setEditorText(
      `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube.`
    );

    cy.get('[data-cy=related-byText]').contains('Reports must have at least').should('exist');
  });

  it('Should show fallback preview image on initial load', () => {
    const values = {
      url: 'https://incidentdatabase.ai',
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
      url: 'https://incidentdatabase.ai',
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

  it('Should show the editor notes field', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    const valuesStep1 = {
      url: 'https://incidentdatabase.ai',
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

    cy.get('[name="editor_notes"').should('exist');
  });

  it('Should show a popover', () => {
    cy.visit(url);

    cy.intercept('GET', parserURL, parseNews).as('parseNews');

    cy.get('[data-cy="label-title"]').trigger('mouseenter');

    cy.get('[data-cy="popover-title"]').should('be.visible');

    cy.get('[data-cy="popover-title"]').contains('h5', 'Headline').should('exist');

    cy.get('[data-cy="popover-title"]').contains('div', 'Most works have a title').should('exist');
  });
});
