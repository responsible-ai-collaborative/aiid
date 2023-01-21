const linkReportsToIncidents = require('../../../../../realm/functions/linkReportsToIncidents');

//should be on its own /cypress/unit folder or something

const incident_1 = {
  AllegedDeployerOfAISystem: [],
  AllegedDeveloperOfAISystem: [],
  AllegedHarmedOrNearlyHarmedParties: [],
  date: '2018-11-16',
  description: 'Description 1',
  incident_id: 1,
  nlp_similar_incidents: [],
  reports: [1, 2],
  title: 'Title 1',
  embedding: {
    vector: [1, 2, 3],
    from_reports: [1, 2],
  },
};

const incident_2 = {
  AllegedDeployerOfAISystem: [],
  AllegedDeveloperOfAISystem: [],
  AllegedHarmedOrNearlyHarmedParties: [],
  date: '2018-11-16',
  description: 'Description 2',
  incident_id: 2,
  nlp_similar_incidents: [],
  reports: [3],
  title: 'Title 2',
  embedding: {
    vector: [4, 5],
    from_reports: [3],
  },
};

const report_1 = {
  report_number: 1,
  title: 'Report 1',
  embedding: {
    vector: [1, 2, 3, 4],
  },
};

const report_2 = {
  report_number: 2,
  title: 'Report 2',
  embedding: {
    vector: [6, 7, 8],
  },
};

const report_3 = {
  report_number: 3,
  title: 'Report 3',
  embedding: {
    vector: [10],
  },
};

describe('Functions', () => {
  it('Should link a new report to two incidents', () => {
    const incidentsCollection = {
      find: cy
        .stub()
        .onFirstCall()
        .returns({
          toArray: cy.stub().resolves([]),
        })
        .onSecondCall()
        .returns({
          toArray: cy.stub().resolves([incident_1, incident_2]),
        })
        .onThirdCall()
        .returns({
          toArray: cy.stub().resolves([]),
        }),
      updateMany: cy.stub().resolves({}),
      updateOne: cy.stub().resolves({}),
    };

    const reportsCollection = {
      find: cy
        .stub()
        .onFirstCall()
        .returns({
          toArray: cy.stub().resolves([report_1, report_2]),
        })
        .onSecondCall()
        .returns({
          toArray: cy.stub().resolves([report_3]),
        }),
      updateOne: cy.stub().resolves(),
      updateMany: cy.stub().resolves({}),
    };

    global.context = {
      // @ts-ignore
      services: {
        get: cy.stub().returns({
          db: cy.stub().returns({
            collection: (() => {
              const stub = cy.stub();

              stub.withArgs('incidents').returns(incidentsCollection);
              stub.withArgs('reports').returns(reportsCollection);

              return stub;
            })(),
          }),
        }),
      },
      functions: {
        execute: cy.stub(),
      },
    };

    global.BSON = { Int32: (x) => x };

    cy.wrap(linkReportsToIncidents({ incident_ids: [1, 2], report_numbers: [3] })).then(() => {
      expect(incidentsCollection.find.firstCall.args[0]).to.deep.equal({
        reports: { $in: [3] },
      });

      expect(incidentsCollection.updateMany.firstCall.args[0]).to.deep.equal({
        reports: { $in: [3] },
      });
      expect(incidentsCollection.updateMany.firstCall.args[1]).to.deep.equal({
        $pull: { reports: { $in: [3] } },
      });

      expect(incidentsCollection.updateMany.secondCall.args[0]).to.deep.equal({
        incident_id: { $in: [1, 2] },
      });
      expect(incidentsCollection.updateMany.secondCall.args[1]).to.deep.equal({
        $addToSet: { reports: { $each: [3] } },
      });

      expect(incidentsCollection.find.secondCall.args[0]).to.deep.equal({
        reports: { $in: [3] },
      });

      expect(reportsCollection.find.firstCall.args[0]).to.deep.equal({
        report_number: { $in: [1, 2] },
      });

      expect(incidentsCollection.updateOne.firstCall.args[0]).to.deep.equal({
        incident_id: 1,
      });
      expect(incidentsCollection.updateOne.firstCall.args[1]).to.deep.equal({
        $set: {
          embedding: {
            vector: [3.5, 4.5, 5.5],
            from_reports: [1, 2],
          },
        },
      });

      expect(incidentsCollection.updateOne.secondCall.args[0]).to.deep.equal({
        incident_id: 2,
      });
      expect(incidentsCollection.updateOne.secondCall.args[1]).to.deep.equal({
        $set: {
          embedding: {
            vector: [10],
            from_reports: [3],
          },
        },
      });

      expect(reportsCollection.updateMany.firstCall.args[0]).to.deep.equal({
        report_number: { $in: [3] },
        text_inputs: { $in: [null, ''] },
        text_outputs: { $in: [null, ''] },
      });
      expect(reportsCollection.updateMany.firstCall.args[1]).to.deep.equal({
        $set: { is_incident_report: true },
      });
    });
  });

  it('Should unlink a report from an incident and set it to issue', () => {
    const incidentsCollection = {
      find: cy
        .stub()
        .onFirstCall()
        .returns({
          toArray: cy.stub().resolves([incident_2]),
        })
        .onSecondCall()
        .returns({
          toArray: cy.stub().resolves([]),
        })
        .onThirdCall()
        .returns({
          toArray: cy.stub().resolves([]),
        }),
      updateMany: cy.stub().resolves({}),
      updateOne: cy.stub().resolves({}),
    };

    const reportsCollection = {
      find: cy
        .stub()
        .onFirstCall()
        .returns({
          toArray: cy.stub().resolves([]),
        }),
      updateOne: cy.stub().resolves(),
      updateMany: cy.stub().resolves({}),
    };

    global.context = {
      // @ts-ignore
      services: {
        get: cy.stub().returns({
          db: cy.stub().returns({
            collection: (() => {
              const stub = cy.stub();

              stub.withArgs('incidents').returns(incidentsCollection);
              stub.withArgs('reports').returns(reportsCollection);

              return stub;
            })(),
          }),
        }),
      },
      functions: {
        execute: cy.stub(),
      },
    };

    chai.config.truncateThreshold = 0;

    global.BSON = { Int32: (x) => x };

    cy.wrap(linkReportsToIncidents({ incident_ids: [], report_numbers: [3] })).then(() => {
      expect(incidentsCollection.find.firstCall.args[0]).to.deep.equal({
        reports: { $in: [3] },
      });

      expect(incidentsCollection.updateMany.firstCall.args[0]).to.deep.equal({
        reports: { $in: [3] },
      });
      expect(incidentsCollection.updateMany.firstCall.args[1]).to.deep.equal({
        $pull: { reports: { $in: [3] } },
      });

      expect(reportsCollection.find.firstCall.args[0]).to.deep.equal({
        report_number: { $in: [] },
      });

      expect(incidentsCollection.updateOne.firstCall.args[0]).to.deep.equal({ incident_id: 2 });
      expect(incidentsCollection.updateOne.firstCall.args[1]).to.deep.equal({
        $unset: { embedding: '' },
      });

      expect(reportsCollection.updateMany.firstCall.args[0]).to.deep.equal({
        report_number: { $in: [3] },
        text_inputs: { $in: [null, ''] },
        text_outputs: { $in: [null, ''] },
      });
      expect(reportsCollection.updateMany.firstCall.args[1]).to.deep.equal({
        $set: { is_incident_report: false },
      });
    });
  });
});
