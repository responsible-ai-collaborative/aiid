import { maybeIt } from '../../support/utils';
import submittedReports from '../../fixtures/submissions/submitted.json';
import quickAdds from '../../fixtures/submissions/quickadds.json';
import { format, getUnixTime } from 'date-fns';

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

    const submission = submittedReports.data.submissions.find((r) => r.incident_id === 0);

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
          promoteSubmissionToReport: [
            {
              __typename: 'Incident',
              incident_id: 182,
              reports: [
                {
                  __typename: 'Report',
                  report_number: 1565,
                },
              ],
            },
          ],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      {
        data: {
          updateOneReport: {
            ...submission,
            deployers: undefined,
            developers: undefined,
            harmed_parties: undefined,
            __typename: 'Report',
            report_number: 1565,
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident',
      {
        data: {
          updateOneIncident: {
            __typename: 'Incident',
            incident_id: 182,
            reports: [
              {
                __typename: 'Report',
                report_number: 1565,
              },
            ],
          },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Add New Incident').click();

    cy.wait('@promoteSubmission')
      .its('request.body.variables.input')
      .then((input) => {
        expect(input.incident_ids).to.deep.eq([]);
        expect(input.submission_id).to.eq('5f9c3ebfd4896d392493f03c');
      });

    cy.wait('@updateReport')
      .its('request.body.variables')
      .then(({ set, query }) => {
        expect(query.report_number).eq(1565);

        expect(set.text).eq(submission.text);
        expect(set.plain_text).eq(submission.plain_text);
        expect(set.title).eq(submission.title);
        expect(set.authors).deep.eq(submission.authors);
        expect(set.submitters).deep.eq(submission.submitters);
        expect(set.source_domain).eq(submission.source_domain);
        expect(set.url).eq(submission.url);
        expect(set.cloudinary_id).eq(submission.cloudinary_id);
        expect(set.image_url).eq(submission.image_url);

        const date_modified = format(new Date(), 'yyyy-MM-dd');

        const epoch_date_modified = getUnixTime(new Date(date_modified));

        expect(set.date_modified).eq(date_modified);
        expect(set.date_downloaded).eq('2020-10-30');
        expect(set.date_published).eq('2017-05-03');
        expect(set.date_submitted).eq('2020-10-30');

        expect(set.epoch_date_modified).eq(epoch_date_modified);
        expect(set.epoch_date_downloaded).eq(1604016000);
        expect(set.epoch_date_published).eq(1493769600);
        expect(set.epoch_date_submitted).eq(1604016000);
      });

    cy.wait('@updateIncident')
      .its('request.body.variables')
      .then(({ query, set }) => {
        expect(query.incident_id).eq(182);

        expect(set.title).eq(submission.title);
        expect(set.date).eq(submission.incident_date);
        expect(set.description).eq(submission.description);
      });

    cy.get('[data-cy="toast"]')
      .contains('Successfully promoted submission to Incident 182 and Report 1565')
      .should('exist');
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
          promoteSubmissionToReport: [
            {
              __typename: 'Incident',
              incident_id: 10,
              reports: [
                {
                  __typename: 'Report',
                  report_number: 1565,
                },
                {
                  __typename: 'Report',
                  report_number: 1566,
                },
              ],
            },
          ],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      {
        data: {
          updateOneReport: {
            ...submission,
            __typename: 'Report',
            report_number: 1566,
          },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Add New Report').click();

    cy.wait('@promoteSubmission')
      .its('request.body.variables.input')
      .then((input) => {
        expect(input.incident_ids).to.deep.eq([10]);
        expect(input.submission_id).to.eq('6123bf345e740c1a81850e89');
      });

    cy.wait('@updateReport')
      .its('request.body.variables')
      .then(({ set, query }) => {
        expect(query.report_number).eq(1566);

        expect(set.text).eq(submission.text);
        expect(set.plain_text).eq(submission.plain_text);
        expect(set.title).eq(submission.title);
        expect(set.authors).deep.eq(submission.authors);
        expect(set.submitters).deep.eq(submission.submitters);
        expect(set.source_domain).eq(submission.source_domain);
        expect(set.url).eq(submission.url);
        expect(set.source_domain).eq(submission.source_domain);
        expect(set.cloudinary_id).eq(submission.cloudinary_id);
        expect(set.image_url).eq(submission.image_url);

        const date_modified = format(new Date(), 'yyyy-MM-dd');

        const epoch_date_modified = getUnixTime(new Date(date_modified));

        expect(set.date_modified).eq(date_modified);

        expect(set.date_downloaded).eq('2021-08-23');
        expect(set.date_published).eq('2019-07-18');
        expect(set.date_submitted).eq('2021-08-23');

        expect(set.epoch_date_modified).eq(epoch_date_modified);
        expect(set.epoch_date_downloaded).eq(1629676800);
        expect(set.epoch_date_published).eq(1563408000);
        expect(set.epoch_date_submitted).eq(1629676800);
      });

    cy.get('[data-cy="toast"]')
      .contains('Successfully promoted submission to Incident 10 and Report 1566')
      .should('exist');
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

    cy.get('@modal').contains('Update').click();

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

  maybeIt(
    'Associate an Incident ID to a submission without developers, deployers or harmed parties',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindSubmissions',
        'FindSubmissions',
        submittedReports
      );

      const submission = submittedReports.data.submissions[2];

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

      cy.get('[name="incident_id"').type('333');

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName === 'UpdateSubmission',
        'UpdateSubmission',
        {
          data: {
            updateOneSubmission: {
              ...submission,
              incident_id: 333,
            },
          },
        }
      );

      cy.get('[data-cy="update-btn"]').click();

      cy.wait('@UpdateSubmission').then((xhr) => {
        expect(xhr.request.body.variables.query).to.deep.nested.include({
          _id: submission._id,
        });

        expect(xhr.request.body.variables.set).to.deep.nested.include({
          incident_id: 333,
        });
      });

      cy.get('@modal').should('not.exist');

      cy.get('[data-cy="toast"]').contains('Submission updated successfully.').should('exist');
    }
  );

  maybeIt(
    'Does not allow promotion of submission if developers, deployers or harmed parties is missing.',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      const submission = submittedReports.data.submissions.find(
        (r) =>
          r.incident_id === 0 &&
          (r.deployers === undefined ||
            r.developers === undefined ||
            r.harmed_parties === undefined)
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

      cy.get('@promoteForm').contains('button', 'Add New Incident').click();

      cy.get('[data-cy="toast"]')
        .contains('Please review submission before approving. Some data is missing.')
        .should('exist');

      cy.wait('@promotionInvoked', { timeout: 2000 });
    }
  );

  maybeIt('Does not allow promotion of submission if description is missing.', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find(
      (r) => r.incident_id === 0 && r.description === undefined
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

    cy.get('@promoteForm').contains('button', 'Add New Incident').click();

    cy.get('[data-cy="toast"]')
      .contains('Please review submission before approving. Some data is missing.')
      .should('exist');

    cy.wait('@promotionInvoked', { timeout: 2000 });
  });

  maybeIt('Should display an error message if data is missing', () => {
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
          submission: submittedReports.data.submissions[2],
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

    cy.get('[data-cy="extra-fields"]').contains('Some data is missing.').should('exist');

    cy.get('[data-cy="update-btn"]').should('be.disabled');

    cy.get('[data-cy="extra-fields"]').click();

    // Fill missing fields and check error messages again

    cy.get('textarea[name=description]').type('Test description');

    cy.get('input[name=developers]').type('developerTest{enter}');

    cy.get('input[name=deployers]').type('deployersTest{enter}');

    cy.get('input[name=harmed_parties]').type('harmedPartiesTest{enter}test{enter}');

    cy.get('@modal')
      .contains('Please review submission. Some data is missing.')
      .should('not.exist');

    cy.get('[data-cy="extra-fields"]').contains('Some data is missing.').should('not.exist');

    cy.get('[data-cy="update-btn"]').should('not.be.disabled');
  });
});
