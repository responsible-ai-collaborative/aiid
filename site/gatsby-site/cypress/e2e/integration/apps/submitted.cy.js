import { maybeIt } from '../../../support/utils';
import submittedReports from '../../../fixtures/submissions/submitted.json';
import quickAdds from '../../../fixtures/submissions/quickadds.json';
import parseNews from '../../../fixtures/api/parseNews.json';
import { isArray } from 'lodash';
import { arrayToList } from '../../../../src/utils/typography';
import { SUBSCRIPTION_TYPE } from '../../../../src/utils/subscriptions';
import { format, getUnixTime } from 'date-fns';
const { gql } = require('@apollo/client');

describe('Submitted reports', () => {
  const url = '/apps/submitted';

  let user;

  before('before', () => {
    cy.query({
      query: gql`
        {
          users {
            userId
            first_name
            last_name
          }
        }
      `,
    }).then(({ data: { users } }) => {
      user = users.find((u) => u.first_name == 'Test' && u.last_name == 'User');
    });
  });

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
        .within(() => {
          cy.get('[data-cy="review-button"]').click();
        });

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
            'incident_ids',
          ];

          for (const key of keys) {
            if (report[key]) {
              let value = report[key];

              if (isArray(value)) {
                value = arrayToList(value);
              }

              cy.get(`[data-cy="${key}"] div:nth-child(2)`).should('contain', value);
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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertSubscription',
      'UpsertSubscription',
      {
        data: {
          upsertOneSubscription: {
            _id: 'dummyIncidentId',
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

    cy.wait('@UpsertSubscription')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.type).to.eq(SUBSCRIPTION_TYPE.incident);
        expect(variables.query.incident_id.incident_id).to.eq(182);
        expect(variables.query.userId.userId).to.eq(user.userId);

        expect(variables.subscription.type).to.eq(SUBSCRIPTION_TYPE.incident);
        expect(variables.subscription.incident_id.link).to.eq(182);
        expect(variables.subscription.userId.link).to.eq(user.userId);
      });

    cy.contains(
      '[data-cy="toast"]',
      'Successfully promoted submission to Incident 182 and Report 1565'
    ).should('exist');
  });

  maybeIt('Promotes a submission to a new report and links it to an existing incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find(
      (r) => r.incident_ids.length == 1 && r.incident_ids.includes(10)
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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertSubscription',
      'UpsertSubscription',
      {
        data: {
          upsertOneSubscription: {
            _id: 'dummyIncidentId',
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

    cy.wait('@UpsertSubscription')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.type).to.eq(SUBSCRIPTION_TYPE.incident);
        expect(variables.query.incident_id.incident_id).to.eq(10);
        expect(variables.query.userId.userId).to.eq(user.userId);

        expect(variables.subscription.type).to.eq(SUBSCRIPTION_TYPE.incident);
        expect(variables.subscription.incident_id.link).to.eq(10);
        expect(variables.subscription.userId.link).to.eq(user.userId);
      });

    cy.contains(
      '[data-cy="toast"]',
      'Successfully promoted submission to Incident 10 and Report 1566'
    ).should('exist');
  });

  maybeIt('Promotes a submission to a new report and links it to multiple incidents', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find(
      (r) => r._id == '444461606b4bb5e39601234'
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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'PromoteSubmission',
      'promoteSubmission',
      {
        data: {
          promoteSubmissionToReport: {
            incident_ids: [52, 53],
            report_number: 1566,
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertSubscription',
      'UpsertSubscription',
      {
        data: {
          upsertOneSubscription: {
            _id: 'dummyIncidentId',
          },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Add to incidents 52 and 53').click();

    cy.wait('@promoteSubmission')
      .its('request.body.variables.input')
      .then((input) => {
        expect(input.incident_ids).to.deep.eq([52, 53]);
        expect(input.submission_id).to.eq('444461606b4bb5e39601234');
        expect(input.is_incident_report).to.eq(true);
      });

    cy.wait('@UpsertSubscription')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.type).to.eq(SUBSCRIPTION_TYPE.incident);
        expect(variables.query.incident_id.incident_id).to.eq(52);
        expect(variables.query.userId.userId).to.eq(user.userId);

        expect(variables.subscription.type).to.eq(SUBSCRIPTION_TYPE.incident);
        expect(variables.subscription.incident_id.link).to.eq(52);
        expect(variables.subscription.userId.link).to.eq(user.userId);
      });

    cy.wait('@UpsertSubscription')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.type).to.eq(SUBSCRIPTION_TYPE.incident);
        expect(variables.query.incident_id.incident_id).to.eq(53);
        expect(variables.query.userId.userId).to.eq(user.userId);

        expect(variables.subscription.type).to.eq(SUBSCRIPTION_TYPE.incident);
        expect(variables.subscription.incident_id.link).to.eq(53);
        expect(variables.subscription.userId.link).to.eq(user.userId);
      });

    cy.contains(
      '[data-cy="toast"]',
      'Successfully promoted submission to Incident 52 and Report 1566'
    ).should('exist');

    cy.contains(
      '[data-cy="toast"]',
      'Successfully promoted submission to Incident 53 and Report 1566'
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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

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

    const submission = submittedReports.data.submissions.find(
      (r) => r.incident_ids.length == 1 && r.incident_ids.includes(10)
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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

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
    const now = new Date();

    cy.clock(now);

    cy.get('@modal').contains('Update').click();

    cy.wait('@UpsertGoogle').its('request.body.variables.entity.entity_id').should('eq', 'google');

    cy.wait('@UpsertAdults').its('request.body.variables.entity.entity_id').should('eq', 'adults');

    cy.wait('@UpdateSubmission').then((xhr) => {
      expect(xhr.request.body.variables.query).to.deep.nested.include({
        _id: submittedReports.data.submissions[0]._id,
      });

      expect(xhr.request.body.variables.set).to.deep.eq({
        authors: ['Nedi Bedi and Kathleen McGrory'],
        cloudinary_id: 'reports/s3.amazonaws.com/ledejs/resized/s2020-pasco-ilp/600/nocco5.jpg',
        date_downloaded: '2020-10-30',
        date_modified: format(now, 'yyyy-MM-dd'),
        date_published: '2017-05-03',
        date_submitted: '2020-10-30',
        epoch_date_modified: getUnixTime(now),
        description:
          'By NEIL BEDI and KATHLEEN McGRORY\nTimes staff writers\nNov. 19, 2020\nThe Pasco Sheriff’s Office keeps a secret list of kids it thinks could “fall into a life of crime” based on factors like wheth',
        image_url: 'https://s3.amazonaws.com/ledejs/resized/s2020-pasco-ilp/600/nocco5.jpg',
        incident_date: '2015-09-01',
        incident_ids: [],
        language: 'en',
        source_domain: 'projects.tampabay.com',
        submitters: ['Kate Perkins'],
        text: '## Another one\n\n**More markdown**\n\nAnother paragraph with more text to reach the minimum character count!',
        plain_text:
          'Another one\n\nMore markdown\n\nAnother paragraph with more text to reach the minimum character count!\n',
        title: 'Submisssion 1 title',
        url: 'https://projects.tampabay.com/projects/2020/investigations/police-pasco-sheriff-targeted/school-data/',
        editor_notes: '',
        developers: { link: ['google'] },
        deployers: { link: ['google'] },
        harmed_parties: { link: ['adults'] },
        nlp_similar_incidents: [],
        editor_dissimilar_incidents: [],
        editor_similar_incidents: [],
        tags: [],
        incident_editors: { link: [] },
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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

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

    cy.get('input[name="url"]').click();

    cy.clickOutside();

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

      cy.get('@promoteForm').within(() => {
        cy.get('[data-cy="review-button"]').click();
      });

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

      cy.get('@promoteForm').within(() => {
        cy.get('[data-cy="review-button"]').click();
      });

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

      cy.get('@promoteForm').within(() => {
        cy.get('[data-cy="review-button"]').click();
      });

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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

    cy.get('[data-cy="edit-submission"]').eq(0).click();

    cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

    cy.get('@modal').contains('Please review submission. Some data is missing.').should('exist');

    cy.get('[data-cy="update-btn"]').should('be.disabled');

    cy.waitForStableDOM();

    cy.get('input[name="title"]').type(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
    );

    cy.get('input[name=authors]').type('Author{enter}');

    cy.setEditorText(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco'
    );

    cy.get('input[name=date_published]').type('2023-01-01');

    cy.get('input[name=date_downloaded]').type('2023-01-01');

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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

    cy.get('[data-cy="edit-submission"]').eq(0).click();

    cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

    cy.get('[data-cy="image-preview-figure"] canvas').should('exist');
  });

  maybeIt('Should display an error message if Date Published is not in the past', () => {
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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

    cy.get('[data-cy="edit-submission"]').eq(0).click();

    cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

    cy.waitForStableDOM();

    cy.get('input[name=date_published]').type('3000-01-01');

    cy.get('@modal').contains('*Date must be in the past').should('exist');

    cy.get('@modal').contains('Please review submission. Some data is missing.').should('exist');

    cy.get('[data-cy="update-btn"]').should('be.disabled');
  });

  maybeIt('Should display an error message if Date Downloaded is not in the past', () => {
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

    cy.get('@promoteForm').within(() => {
      cy.get('[data-cy="review-button"]').click();
    });

    cy.get('[data-cy="edit-submission"]').eq(0).click();

    cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

    cy.waitForStableDOM();

    cy.get('input[name=date_downloaded]').type('3000-01-01');

    cy.get('@modal').contains('*Date must be in the past').should('exist');

    cy.get('@modal').contains('Please review submission. Some data is missing.').should('exist');

    cy.get('[data-cy="update-btn"]').should('be.disabled');
  });

  maybeIt(
    'Edits a submission - links to existing incident - Incident Data should be hidden',
    () => {
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

      cy.visit(url);

      cy.wait('@FindSubmissions');

      cy.get('[data-cy="submission"]').first().as('promoteForm');

      cy.get('@promoteForm').within(() => {
        cy.get('[data-cy="review-button"]').click();
      });

      cy.get('[data-cy="edit-submission"]').eq(0).click();

      cy.get('[data-cy="submission-modal"]').as('modal').should('be.visible');

      cy.waitForStableDOM();

      cy.get(`input[name="incident_ids"]`).type('1');

      cy.waitForStableDOM();

      cy.get(`[role="option"]`).first().click();

      cy.waitForStableDOM();

      cy.get('[data-cy="incident-data-section"]').should('not.exist');

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName === 'UpdateSubmission',
        'UpdateSubmission',
        {
          data: {
            updateOneSubmission: {
              ...submittedReports.data.submissions[0],
              incident_ids: [1],
            },
          },
        }
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) =>
          req.body.operationName == 'UpsertEntity' &&
          req.body.variables.entity.entity_id == 'adults',
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
          req.body.operationName == 'UpsertEntity' &&
          req.body.variables.entity.entity_id == 'google',
        'UpsertGoogle',
        {
          data: {
            upsertOneEntity: { __typename: 'Entity', entity_id: 'google', name: 'Google' },
          },
        }
      );

      cy.get('@modal').contains('Update').click();

      cy.wait('@UpsertGoogle')
        .its('request.body.variables.entity.entity_id')
        .should('eq', 'google');

      cy.wait('@UpsertAdults')
        .its('request.body.variables.entity.entity_id')
        .should('eq', 'adults');

      cy.wait('@UpdateSubmission').then((xhr) => {
        expect(xhr.request.body.variables.query).to.deep.nested.include({
          _id: submittedReports.data.submissions[0]._id,
        });

        expect(xhr.request.body.variables.set).to.deep.nested.include({
          incident_ids: [1],
        });
      });

      cy.get('@modal').should('not.exist');
    }
  );
});
