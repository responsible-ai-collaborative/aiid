import { maybeIt } from '../../../support/utils';
import riskSortingRisks from '../../../fixtures/checklists/riskSortingRisks.json';
import riskSortingChecklist from '../../../fixtures/checklists/riskSortingChecklist.json';
const { gql } = require('@apollo/client');

describe('Checklists App Form', () => {
  const url = '/apps/checklists?id=testChecklist';

  const defaultChecklist = {
    __typename: 'Checklist',
    about: '',
    id: 'testChecklist',
    name: 'Test Checklist',
    owner_id: 'a-fake-user-id-that-does-not-exist',
    risks: [],
    tags_goals: [],
    tags_methods: [],
    tags_other: [],
  };

  const usersQuery = {
    query: gql`
      {
        users(limit: 9999) {
          userId
          roles
          adminData {
            email
          }
        }
      }
    `,
    timeout: 120000, // mongodb admin api is extremely slow
  };

  const withLogin = (callback) => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.query(usersQuery).then(({ data: { users } }) => {
      const user = users.find((user) => user.adminData.email == Cypress.env('e2eUsername'));

      callback({ user });
    });
  };

  const interceptFindChecklist = (checklist) => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'findChecklist',
      'findChecklist',
      { data: { checklist } }
    );
  };

  const interceptUpsertChecklist = (checklist) => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'upsertChecklist',
      'upsertChecklist',
      { data: { checklist } }
    );
  };

  const interceptFindRisks = (risks) => {
    cy.conditionalIntercept('**/graphql', (req) => req.body.query.includes('GMF'), 'findRisks', {
      data: { risks },
    });
  };

  it.skip('Should have read-only access for non-logged-in users', () => {
    interceptFindChecklist(defaultChecklist);

    cy.visit(url);

    cy.wait(['@findChecklist']);

    cy.waitForStableDOM();

    cy.get('[data-cy="checklist-form"] textarea:not([disabled])').should('not.exist');

    cy.get('[data-cy="checklist-form"] input:not([disabled]):not([readonly])').should('not.exist');
  });

  maybeIt('Should have read-only access for logged-in non-owners', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    interceptFindChecklist(defaultChecklist);

    cy.visit(url);

    cy.wait(['@findChecklist']);

    cy.waitForStableDOM();

    cy.get('[data-cy="checklist-form"] textarea:not([disabled])').should('not.exist');

    cy.get('[data-cy="checklist-form"] input:not([disabled]):not([readonly])').should('not.exist');
  });

  maybeIt('Should allow editing for owner', () => {
    withLogin(({ user }) => {
      interceptFindChecklist({ ...defaultChecklist, owner_id: user.userId });
      interceptUpsertChecklist({
        ...defaultChecklist,
        owner_id: user.userId,
        about: "It's a system that does something probably.",
      });

      cy.visit(url);

      cy.wait(['@findChecklist']);

      cy.waitForStableDOM();

      cy.get('[data-cy="about"]').type("It's a system that does something probably.");

      cy.wait(['@upsertChecklist']);
    });
  });

  maybeIt('Should trigger GraphQL upsert query on adding tag', () => {
    withLogin(({ user }) => {
      interceptFindChecklist({ ...defaultChecklist, owner_id: user.userId });
      interceptUpsertChecklist({});

      cy.visit(url);

      cy.get('#tags_goals_input').type('Code Generation');
      cy.get('#tags_goals').contains('Code Generation').click();

      cy.wait(['@upsertChecklist']).then((xhr) => {
        expect(xhr.request.body.variables.checklist).to.deep.nested.include({
          tags_goals: ['GMF:Known AI Goal:Code Generation'],
        });
      });
    });
  });

  maybeIt('Should trigger GraphQL update on removing tag', () => {
    withLogin(({ user }) => {
      interceptFindChecklist({
        ...defaultChecklist,
        owner_id: user.userId,
        tags_goals: ['GMF:Known AI Goal:Code Generation'],
      });
      interceptUpsertChecklist({});

      cy.visit(url);

      cy.get('[option="GMF:Known AI Goal:Code Generation"] .close').click();

      cy.wait(['@upsertChecklist']).then((xhr) => {
        expect(xhr.request.body.variables.checklist).to.deep.nested.include({
          tags_goals: [],
        });
      });

      cy.visit(url);
    });
  });

  maybeIt('Should trigger UI update on adding and removing tag', () => {
    withLogin(({ user }) => {
      interceptFindChecklist({
        ...defaultChecklist,
        owner_id: user.userId,
      });
      interceptUpsertChecklist({});

      cy.visit(url);

      cy.get('#tags_methods_input').type('Transformer');
      cy.get('#tags_methods').contains('Transformer').click();

      cy.waitForStableDOM();

      cy.get('details').should('exist');

      cy.get('.rbt-close').click();

      cy.waitForStableDOM();

      cy.get('details').should('not.exist');
    });
  });

  it('Should change sort order of risk items', () => {
    cy.viewport(1920, 1080);

    withLogin(({ user }) => {
      interceptFindChecklist({
        ...riskSortingChecklist.data.checklist,
        owner_id: user.userId,
      });

      interceptFindRisks(riskSortingRisks.data.risks);

      cy.visit(url);

      cy.wait(['@findChecklist']);

      cy.wait(['@findRisks']);

      cy.waitForStableDOM();

      cy.contains('Mitigated').click();

      cy.get('details:nth(1)').contains('Distributional Bias').should('exist');

      cy.contains('Minor').click();

      cy.get('details:nth(1)').contains('Dataset Imbalance').should('exist');
    });
  });

  it('Should remove a manually-created risk', () => {
    withLogin(({ user }) => {
      interceptFindChecklist({
        ...defaultChecklist,
        owner_id: user.userId,
        risks: [
          {
            __typename: 'ChecklistRisk',
            generated: false,
            id: '5bb31fa6-2d32-4a01-b0a0-fa3fb4ec4b7d',
            likelihood: '',
            precedents: [],
            risk_notes: '',
            risk_status: 'Mitigated',
            severity: '',
            tags: ['GMF:Known AI Goal:Content Search'],
            title: 'Manual Test Risk',
            touched: false,
          },
        ],
      });
      interceptUpsertChecklist({ ...defaultChecklist, owner_id: user.userId });

      cy.visit(url);

      cy.contains('Manual Test Risk').get('svg > title').contains('Delete Risk').parent().click();

      cy.wait('@upsertChecklist');

      cy.contains('Manual Test Risk').should('not.exist');
    });
  });

  maybeIt('Should edit checklist title', () => {
    withLogin(({ user }) => {
      interceptFindChecklist({ ...defaultChecklist, owner_id: user.userId });
      interceptUpsertChecklist({});

      cy.visit(url);

      cy.get('[data-cy="edit-checklist-name"] [data-cy="edit-button"]').click();
      cy.get('[data-cy="edit-checklist-name"] input').type('{selectall}{backspace}Modified Title');
      cy.get('[data-cy="edit-checklist-name"] input').blur();

      cy.wait(['@upsertChecklist']).then((xhr) => {
        expect(xhr.request.body.variables.checklist).to.deep.nested.include({
          name: 'Modified Title',
        });
      });
    });
  });
  maybeIt('Should edit risk title', () => {
    withLogin(({ user }) => {
      interceptFindChecklist({
        ...defaultChecklist,
        owner_id: user.userId,
        risks: defaultRisks,
      });

      interceptUpsertChecklist({});

      cy.visit(url);

      cy.wait(['@findChecklist']);
      cy.waitForStableDOM();

      cy.get('[data-cy="edit-risk-title"] [data-cy="edit-button"]').click();
      cy.get('[data-cy="edit-risk-title"] input').type('{selectall}{backspace}Modified Risk Title');
      cy.get('[data-cy="edit-risk-title"] input').blur();

      cy.wait(['@upsertChecklist']).then((xhr) => {
        expect(xhr.request.body.variables.checklist.risks[0]).to.deep.nested.include({
          title: 'Modified Risk Title',
        });
      });
    });
  });
});

const defaultRisks = [
  {
    id: 'fc253cb9-4b6a-4f73-9207-732228d80a9e',
    title: 'Unsafe Exposure or Access',
    risk_status: 'Mitigated',
    risk_notes: '',
    severity: '',
    likelihood: '',
    touched: false,
    generated: false,
    tags: ['GMF:Known AI Technical Failure:Unsafe Exposure or Access'],
    precedents: [
      {
        tags: [
          'GMF:Known AI Goal:Chatbot',
          'GMF:Known AI Technology:Autoencoder',
          'GMF:Known AI Technology:Distributional Learning',
          'GMF:Known AI Technical Failure:Adversarial Data',
          'GMF:Known AI Technical Failure:Distributional Bias',
          'GMF:Known AI Technical Failure:Unauthorized Data',
          'GMF:Known AI Technical Failure:Inadequate Anonymization',
          'GMF:Known AI Technical Failure:Inappropriate Training Content',
          'GMF:Known AI Technical Failure:Unsafe Exposure or Access',
        ],
        incident_id: 106,
        description:
          'A Korean interactive chatbot was shown in screenshots to have used derogatory and bigoted language when asked about lesbians, Black people, and people with disabilities.',
        title: 'Korean Chatbot Luda Made Offensive Remarks towards Minority Groups',
      },
    ],
  },
];
