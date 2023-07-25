const logIncidentHistory = require('../../../../../realm/functions/logIncidentHistory');

const incidentsSchema = require('../../../../../realm/data_sources/mongodb-atlas/aiidprod/incidents/schema.json');

const historyIncidentsSchema = require('../../../../../realm/data_sources/mongodb-atlas/history/incidents/schema.json');

const incidentInput = {
  incident_id: 545,
  title: 'Chatbot Tessa gives unauthorized diet advice to users seeking help for eating disorders',
  description:
    'The National Eating Disorders Association (NEDA) has shut down its chatbot named Tessa after it gave weight-loss advice to users seeking help for eating disorders. The incident has raised concerns about the risks of using chatbots and AI assistants in healthcare settings, particularly in addressing sensitive issues like eating disorders. NEDA is investigating the matter, emphasizing the need for caution and accuracy when utilizing technology to provide mental health support.',
  reports: [3103, 3104],
  editors: ['63320ce63ec803072c9f529c'],
  date: '2023-05-29',
  AllegedDeployerOfAISystem: ['national-eating-disorders-association', 'cass'],
  AllegedDeveloperOfAISystem: ['cass'],
  AllegedHarmedOrNearlyHarmedParties: ['people-with-eating-disorders'],
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
  modifiedBy: '63320ce63ec803072c9f529c',
  epoch_date_modified: 1685318400,
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

    cy.wrap(logIncidentHistory(incidentInput)).then(() => {
      const {
        AllegedDeployerOfAISystem,
        AllegedDeveloperOfAISystem,
        AllegedHarmedOrNearlyHarmedParties,
        ...incident
      } = incidentInput;

      incident['Alleged deployer of AI system'] = AllegedDeployerOfAISystem;
      incident['Alleged developer of AI system'] = AllegedDeveloperOfAISystem;
      incident['Alleged harmed or nearly harmed parties'] = AllegedHarmedOrNearlyHarmedParties;

      expect(incidentsHistoryCollection.insertOne.firstCall.args[0]).to.deep.equal(incident);
    });
  });

  it('Incident schema should be the same as History Incident schema', () => {
    expect(historyIncidentsSchema.properties).to.deep.equal({
      ...incidentsSchema.properties,
      modifiedBy: {
        bsonType: 'string',
      },
    });
    expect(historyIncidentsSchema.required).to.deep.equal(incidentsSchema.required);
  });
});
