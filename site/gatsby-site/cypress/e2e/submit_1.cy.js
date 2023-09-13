import { isArray } from 'lodash';
import { arrayToList } from '../../src/utils/typography';
import parseNews from '../fixtures/api/parseNews.json';
import semanticallyRelated from '../fixtures/api/semanticallyRelated.json';
import users from '../fixtures/users/users.json';
import { maybeIt } from '../support/utils';

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
        incident_ids: [],
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

    cy.get('.tw-toast')
      .contains('Report successfully added to review queue. You can see your submission')
      .should('exist');

    cy.contains('Please review. Some data is missing.').should('not.exist');
  });

  it('Should autocomplete entities', () => {
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

    cy.get('[data-cy="to-step-3"]').click();

    cy.get('input[name="deployers"]').type('YouT');

    cy.get('#deployers-tags .dropdown-item')
      .contains(/^YouTube$/)
      .click();

    cy.get('button[type="submit"]').click();

    cy.wait('@insertSubmission').then((xhr) => {
      expect(xhr.request.body.variables.submission).to.deep.nested.include({
        title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
        authors: ['Valentina Palladino'],
        date_published: '2017-11-10',
        image_url:
          'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
        incident_ids: [],
        text: "## Recent news stories and blog\n\nposts _highlighted_ the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.",
        plain_text:
          "Recent news stories and blog\n\nposts highlighted the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.\n",
        url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
        source_domain: `arstechnica.com`,
        deployers: { link: ['youtube'] },
      });
    });

    cy.get('.tw-toast')
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

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindUsers',
        'findUsers',
        users
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

      cy.get('[name="language"]').select('Spanish');

      cy.get('[data-cy="to-step-3"]').click();

      cy.wait('@findUsers');

      cy.get('[name="incident_title"]').type('Elsagate');

      cy.get('[name="description"]').type('Description');

      cy.get('#input-incident_editors').type('Test');

      cy.get('[aria-label="Test User"]').click();

      cy.get('[name="tags"]').type('New Tag{enter}');

      cy.get('[name="editor_notes"').type('Here are some notes');

      cy.get('button[type="submit"]').click();

      cy.wait('@insertSubmission').then((xhr) => {
        expect(xhr.request.body.variables.submission).to.deep.nested.include({
          title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
          submitters: ['Test User'],
          authors: ['Valentina Palladino'],
          incident_date: '2020-01-01',
          incident_editors: { link: ['63320ce63ec803072c9f529c'] },
          incident_title: 'Elsagate',
          date_published: '2017-11-10',
          image_url:
            'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
          tags: ['New Tag'],
          incident_ids: [],
          text: "## Recent news stories and blog\n\nposts _highlighted_ the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.",
          plain_text:
            "Recent news stories and blog\n\nposts highlighted the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.\n",
          url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
          source_domain: `arstechnica.com`,
          language: 'es',
          editor_notes: 'Here are some notes',
          description: 'Description',
        });

        expect(xhr.request.body.variables.submission.user.link).to.not.be.undefined;
      });

      cy.get('.tw-toast')
        .contains('Report successfully added to review queue')
        .should('be.visible');

      cy.get('.tw-toast a').should('have.attr', 'href', '/apps/submitted/');

      cy.contains('Please review. Some data is missing.').should('not.exist');
    }
  );

  it('Should submit a new report linked to incident 1 once all fields are filled properly', () => {
    cy.intercept('GET', parserURL, parseNews).as('parseNews');

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
              incident_ids: [1],
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

    cy.waitForStableDOM();

    cy.get(
      '[data-cy=related-byText] [data-cy=result] [data-cy="similar-selector"] [data-cy="similar"]'
    )
      .last()
      .click();

    cy.waitForStableDOM();

    cy.clickOutside();

    cy.get('.form-has-errors').should('not.exist');

    cy.get('[data-cy="to-step-2"]').click();

    cy.waitForStableDOM();

    cy.wait('@FindIncidentsTitles');

    cy.get('[data-cy="to-step-3"]').click();

    cy.waitForStableDOM();

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
        incident_ids: [1],
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
      incident_ids: [1],
      url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
      source_domain: 'arstechnica.com',
      language: 'en',
      editor_notes: 'Here are some notes',
    };

    for (let key in expectedValues) {
      cy.get(`[data-cy="${key}"]`)
        .contains(
          isArray(expectedValues[key]) ? arrayToList(expectedValues[key]) : expectedValues[key]
        )
        .should('exist');
    }

    cy.contains('Please review. Some data is missing.').should('not.exist');
  });
});
