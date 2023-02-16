import { maybeIt } from '../../../support/utils';
import submittedReports from '../../../fixtures/submissions/submitted.json';
import quickAdds from '../../../fixtures/submissions/quickadds.json';
import parseNews from '../../../fixtures/api/parseNews.json';

describe('Submitted reports', () => {
  const url = '/apps/submitted';

  it('Loads submissions', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmission',
      submittedReports
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'AllQuickAdd',
      'AllQuickAdd',
      {
        data: {
          quickadds: [quickAdds],
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmission');

    cy.wait('@AllQuickAdd');

    const submissions = submittedReports.data.submissions;

    cy.get('[data-cy="submissions"] > div').should('have.length', submissions.length);

    submissions.forEach((report, index) => {
      cy.get('[data-cy="submissions"]')
        .children(`:nth-child(${index + 1})`)
        .contains('review >')
        .click();

      cy.get('[data-cy="submissions"]')
        .children(`:nth-child(${index + 1})`)
        .within(() => {
          const keys = [
            'source_domain',
            'authors',
            'submitters',
            'incident_id',
            'date_published',
            'date_submitted',
            'date_downloaded',
            'date_modified',
            'url',
          ];

          for (const key of keys) {
            if (report[key]) {
              cy.get(`[data-cy="${key}"] div:nth-child(2)`).should('contain', report[key]);
            } else {
              cy.get(`[data-cy="${key}"] div:nth-child(2)`).should('not.exist');
            }
          }
        });
    });
  });

  maybeIt('Promotes a submission to a new report and links it to a new incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find(
      (r) => r._id === '5f9c3ebfd4896d392493f03c'
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      {
        data: {
          submissions: [submission],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'AllQuickAdd',
      'AllQuickAdd',
      {
        data: {
          quickadds: [quickAdds],
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.wait('@AllQuickAdd');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'PromoteSubmission',
      'promoteSubmission',
      {
        data: {
          promoteSubmissionToReport: {
            incident_ids: [182],
            report_number: 1565,
          },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Add new Incident').click();

    cy.wait('@promoteSubmission')
      .its('request.body.variables.input')
      .then((input) => {
        expect(input.incident_ids).to.deep.eq([]);
        expect(input.submission_id).to.eq('5f9c3ebfd4896d392493f03c');
        expect(input.is_incident_report).to.eq(true);
      });

    cy.contains(
      '[data-cy="toast"]',
      'Successfully promoted submission to Incident 182 and Report 1565'
    ).should('exist');
  });

  maybeIt('Promotes a submission to a new report and links it to an existing incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find((r) => r.incident_id === 10);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      {
        data: {
          submissions: [submission],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'AllQuickAdd',
      'AllQuickAdd',
      {
        data: {
          quickadds: [quickAdds],
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.wait('@AllQuickAdd');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'PromoteSubmission',
      'promoteSubmission',
      {
        data: {
          promoteSubmissionToReport: {
            incident_ids: [10],
            report_number: 1566,
          },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Add to incident 10').click();

    cy.wait('@promoteSubmission')
      .its('request.body.variables.input')
      .then((input) => {
        expect(input.incident_ids).to.deep.eq([10]);
        expect(input.submission_id).to.eq('6123bf345e740c1a81850e89');
        expect(input.is_incident_report).to.eq(true);
      });

    cy.contains(
      '[data-cy="toast"]',
      'Successfully promoted submission to Incident 10 and Report 1566'
    ).should('exist');
  });

  maybeIt('Promotes a submission to a new issue', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find(
      (r) => r._id === '62d561606b4bb5e39605555'
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      {
        data: {
          submissions: [submission],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'AllQuickAdd',
      'AllQuickAdd',
      {
        data: {
          quickadds: [quickAdds],
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.wait('@AllQuickAdd');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'PromoteSubmission',
      'promoteSubmission',
      {
        data: {
          promoteSubmissionToReport: {
            incident_ids: [10],
            report_number: 1566,
          },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Add as issue').click();

    cy.wait('@promoteSubmission')
      .its('request.body.variables.input')
      .then((input) => {
        expect(input.incident_ids).to.deep.eq([]);
        expect(input.submission_id).to.eq('62d561606b4bb5e39605555');
        expect(input.is_incident_report).to.eq(false);
      });

    cy.contains('[data-cy="toast"]', 'Successfully promoted submission to Issue 1566').should(
      'exist'
    );
  });

  maybeIt('Rejects a submission', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find((r) => r.incident_id === 10);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      {
        data: {
          submissions: [submission],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'AllQuickAdd',
      'AllQuickAdd',
      {
        data: {
          quickadds: [quickAdds],
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.wait('@AllQuickAdd');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'DeleteSubmission',
      'DeleteSubmission',
      {
        data: {
          deleteOneSubmission: { __typename: 'Submission', _id: '6123bf345e740c1a81850e89' },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Reject New Report').click();

    cy.wait('@DeleteSubmission').then((xhr) => {
      expect(xhr.request.body.variables._id).to.eq('6123bf345e740c1a81850e89');
    });

    cy.get('[data-cy="submissions"]').children().should('have.length', 0);
  });

  maybeIt('Edits a submission - update just a text', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      submittedReports
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmission',
      'FindSubmission',
      {
        data: {
          submission: submittedReports.data.submissions[0],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindEntities',
      'FindEntities',
      {
        data: {
          entities: [
            { __typename: 'Entity', entity_id: 'Adults', name: 'adults' },
            { __typename: 'Entity', entity_id: 'Google', name: 'google' },
          ],
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.get('[data-cy="edit-submission"]').eq(0).click();

    cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

    cy.setEditorText(
      '## Another one\n\n**More markdown**\n\nAnother paragraph with more text to reach the minimum character count!'
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName === 'UpdateSubmission',
      'UpdateSubmission',
      {
        data: {
          updateOneSubmission: {
            ...submittedReports.data.submissions[0],
            text: '## Another one\n\n**More markdown**\n\nAnother paragraph with more text to reach the minimum character count!',
            plain_text:
              'Another one\n\nMore markdown\n\nAnother paragraph with more text to reach the minimum character count!\n',
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpsertEntity' && req.body.variables.entity.entity_id == 'adults',
      'UpsertAdults',
      {
        data: {
          upsertOneEntity: { __typename: 'Entity', entity_id: 'adults', name: 'Adults' },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpsertEntity' && req.body.variables.entity.entity_id == 'google',
      'UpsertGoogle',
      {
        data: {
          upsertOneEntity: { __typename: 'Entity', entity_id: 'google', name: 'Google' },
        },
      }
    );

    cy.get('@modal').contains('Update').click();

    cy.wait('@UpsertGoogle').its('request.body.variables.entity.entity_id').should('eq', 'google');

    cy.wait('@UpsertAdults').its('request.body.variables.entity.entity_id').should('eq', 'adults');

    cy.wait('@UpdateSubmission').then((xhr) => {
      expect(xhr.request.body.variables.query).to.deep.nested.include({
        _id: submittedReports.data.submissions[0]._id,
      });

      expect(xhr.request.body.variables.set).to.deep.nested.include({
        text: '## Another one\n\n**More markdown**\n\nAnother paragraph with more text to reach the minimum character count!',
        plain_text:
          'Another one\n\nMore markdown\n\nAnother paragraph with more text to reach the minimum character count!\n',
      });
    });

    cy.get('@modal').should('not.exist');
  });

  maybeIt('Edits a submission - uses fetch info', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      submittedReports
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmission',
      'FindSubmission',
      {
        data: {
          submission: submittedReports.data.submissions[0],
        },
      }
    );

    cy.intercept('GET', '/api/parseNews**', parseNews).as('parseNews');

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindEntities',
      'FindEntities',
      {
        data: {
          entities: [
            { __typename: 'Entity', entity_id: 'Adults', name: 'adults' },
            { __typename: 'Entity', entity_id: 'Google', name: 'google' },
          ],
        },
      }
    );

    cy.get('[data-cy="edit-submission"]').eq(0).click();

    cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

    cy.get('[data-cy="fetch-info"]').click();

    cy.wait('@parseNews');

    cy.get('input[label="Title"]').should(
      'have.attr',
      'value',
      'YouTube to crack down on inappropriate content masked as kids’ cartoons'
    );
    cy.get('input[label="Image Address"]').should(
      'have.attr',
      'value',
      'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png'
    );
    cy.get('input[label="Date Published"]').should('have.attr', 'value', '2017-11-10');
    cy.get('input[label="Date Downloaded"]').should('have.attr', 'value', '2022-05-26');
  });

  maybeIt(
    'Does not allow promotion of submission to Incident if schema is invalid (missing Description).',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      const submission = submittedReports.data.submissions.find(
        (r) => r._id === '62d561606b4bb5e396034444'
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindSubmissions',
        'FindSubmissions',
        {
          data: {
            submissions: [submission],
          },
        }
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'AllQuickAdd',
        'AllQuickAdd',
        {
          data: {
            quickadds: [quickAdds],
          },
        }
      );

      cy.visit(url);

      cy.wait('@FindSubmissions');

      cy.wait('@AllQuickAdd');

      cy.get('[data-cy="submission"]').first().as('promoteForm');

      cy.get('@promoteForm').contains('review >').click();

      cy.on('fail', (err) => {
        expect(err.message).to.include(
          '`cy.wait()` timed out waiting `2000ms` for the 1st request to the route: `promotionInvoked`. No request ever occurred.'
        );
      });

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName === 'PromoteSubmission',
        'promotionInvoked',
        {}
      );

      cy.get('@promoteForm').contains('button', 'Add new Incident').click();

      cy.contains('[data-cy="toast"]', 'Description is required.').should('exist');

      cy.wait('@promotionInvoked', { timeout: 2000 });
    }
  );

  maybeIt(
    'Does not allow promotion of submission to Issue if schema is invalid (missing Title).',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      const submission = submittedReports.data.submissions.find(
        (r) => r._id === '123461606b4bb5e39601234'
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindSubmissions',
        'FindSubmissions',
        {
          data: {
            submissions: [submission],
          },
        }
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'AllQuickAdd',
        'AllQuickAdd',
        {
          data: {
            quickadds: [quickAdds],
          },
        }
      );

      cy.visit(url);

      cy.wait('@FindSubmissions');

      cy.wait('@AllQuickAdd');

      cy.get('[data-cy="submission"]').first().as('promoteForm');

      cy.get('@promoteForm').contains('review >').click();

      cy.on('fail', (err) => {
        expect(err.message).to.include(
          '`cy.wait()` timed out waiting `2000ms` for the 1st request to the route: `promotionInvoked`. No request ever occurred.'
        );
      });

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName === 'PromoteSubmission',
        'promotionInvoked',
        {}
      );

      cy.get('@promoteForm').contains('button', 'Add as issue').click();

      cy.contains('[data-cy="toast"]', 'Title is required').should('exist');

      cy.wait('@promotionInvoked', { timeout: 2000 });
    }
  );

  maybeIt(
    'Does not allow promotion of submission to Report if schema is invalid (missing Date).',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      const submission = submittedReports.data.submissions.find(
        (r) => r._id === '333561606b4bb5e39601234'
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindSubmissions',
        'FindSubmissions',
        {
          data: {
            submissions: [submission],
          },
        }
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'AllQuickAdd',
        'AllQuickAdd',
        {
          data: {
            quickadds: [quickAdds],
          },
        }
      );

      cy.visit(url);

      cy.wait('@FindSubmissions');

      cy.wait('@AllQuickAdd');

      cy.get('[data-cy="submission"]').first().as('promoteForm');

      cy.get('@promoteForm').contains('review >').click();

      cy.on('fail', (err) => {
        expect(err.message).to.include(
          '`cy.wait()` timed out waiting `2000ms` for the 1st request to the route: `promotionInvoked`. No request ever occurred.'
        );
      });

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName === 'PromoteSubmission',
        'promotionInvoked',
        {}
      );

      cy.get('@promoteForm').contains('button', 'Add to incident 12').click();

      cy.contains('[data-cy="toast"]', '*Date is not valid, must be `YYYY-MM-DD`').should('exist');

      cy.wait('@promotionInvoked', { timeout: 2000 });
    }
  );

  maybeIt('Should display an error message if data is missing', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find(
      (r) => r._id === '62d561606b4bb5e39601234'
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      {
        data: {
          submissions: [submission],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmission',
      'FindSubmission',
      {
        data: {
          submission,
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.get('[data-cy="edit-submission"]').eq(0).click();

    cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

    cy.get('@modal').contains('Please review submission. Some data is missing.').should('exist');

    cy.get('[data-cy="update-btn"]').should('be.disabled');

    cy.get('input[name="title"]').type(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
    );

    cy.get('input[name=authors]').type('Author{enter}');

    cy.setEditorText(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco'
    );

    cy.get('input[name=date_published]').type('3033-01-01');

    cy.get('input[name=date_downloaded]').type('3033-01-01');

    cy.get('@modal')
      .contains('Please review submission. Some data is missing.')
      .should('not.exist');

    cy.get('[data-cy="update-btn"]').should('not.be.disabled');
  });

  maybeIt('Should display submission image on edit modal', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find(
      (s) => s.cloudinary_id && s.cloudinary_id != 'reports/' && s.cloudinary_id != ''
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      {
        data: {
          submissions: [submission],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmission',
      'FindSubmission',
      {
        data: {
          submission,
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'AllQuickAdd',
      'AllQuickAdd',
      {
        data: {
          quickadds: [quickAdds],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindEntities',
      'FindEntities',
      {
        data: {
          entities: [
            { __typename: 'Entity', entity_id: 'Adults', name: 'adults' },
            { __typename: 'Entity', entity_id: 'Google', name: 'google' },
          ],
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.wait('@AllQuickAdd');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.get('[data-cy="edit-submission"]').eq(0).click();

    cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

    cy.waitForStableDOM();

    cy.get('[data-cy="image-preview-figure"] img').should(
      'have.attr',
      'src',
      'https://res.cloudinary.com/pai/image/upload/f_auto/q_auto/v1/reports/s3.amazonaws.com/ledejs/resized/s2020-pasco-ilp/600/nocco5.jpg'
    );
  });

  maybeIt('Should display fallback image on edit modal if submission doesnt have an image', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find((s) => s.cloudinary_id === null);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      {
        data: {
          submissions: [submission],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmission',
      'FindSubmission',
      {
        data: {
          submission,
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'AllQuickAdd',
      'AllQuickAdd',
      {
        data: {
          quickadds: [quickAdds],
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.wait('@AllQuickAdd');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.get('[data-cy="edit-submission"]').eq(0).click();

    cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

    cy.get('[data-cy="image-preview-figure"] canvas').should('exist');
  });
});
