const logIncidentHistory = require('../../../../../realm/functions/logIncidentHistory');

const incident = {
  incident_id: 545,
  title: 'Chatbot Tessa gives unauthorized diet advice to users seeking help for eating disorders',
  description:
    'The National Eating Disorders Association (NEDA) has shut down its chatbot named Tessa after it gave weight-loss advice to users seeking help for eating disorders. The incident has raised concerns about the risks of using chatbots and AI assistants in healthcare settings, particularly in addressing sensitive issues like eating disorders. NEDA is investigating the matter, emphasizing the need for caution and accuracy when utilizing technology to provide mental health support.',
  reports: [3103, 3104],
  editors: ['Daniel Atherton'],
  date: '2023-05-29',
  'Alleged deployer of AI system': ['national-eating-disorders-association', 'cass'],
  'Alleged developer of AI system': ['cass'],
  'Alleged harmed or nearly harmed parties': ['people-with-eating-disorders'],
  nlp_similar_incidents: [
    {
      incident_id: 6,
      similarity: 0.9976733922958374,
    },
    {
      incident_id: 279,
      similarity: 0.9975948333740234,
    },
    {
      incident_id: 7,
      similarity: 0.9975897669792175,
    },
  ],
  editor_similar_incidents: [],
  editor_dissimilar_incidents: [],
  embedding: {
    vector: [-0.083877206262615, 0.06872937753796578],
    from_reports: [3148, 3147],
  },
  tsne: {
    x: -0.28079595740348834,
    y: -0.3189867109991937,
  },
  editor: 'Daniel Atherton',
  epoch_date_modified: 1685318400,
  user: { link: '63320ce63ec803072c9f529c' },
};

describe('Functions', () => {
  it('Should log a new incident', () => {
    const incidentsHistoryCollection = {
      insertOne: cy.stub().resolves(),
    };

    global.context = {
      // @ts-ignore
      services: {
        get: cy.stub().returns({
          db: cy.stub().returns({
            collection: (() => {
              const stub = cy.stub();

              stub.withArgs('incidents').returns(incidentsHistoryCollection);

              return stub;
            })(),
          }),
        }),
      },
    };

    cy.wrap(logIncidentHistory(incident)).then(() => {
      expect(incidentsHistoryCollection.insertOne.firstCall.args[0]).to.deep.equal(incident);
    });
  });
});
