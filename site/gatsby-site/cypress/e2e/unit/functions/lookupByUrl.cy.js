const lookupByUrl = require('../../../../../realm/functions/lookupByUrl');

//should be on its own /cypress/unit folder or something

const incident_1 = {
  incident_id: 1,
  title: 'Title 1',
  reports: [1, 2],
};

const report_1 = {
  report_number: 1,
  title: 'Report 1',
  url: 'https://report1.com',
};

describe('Functions', () => {
  it('Should return matching reports', () => {
    const incidentsCollection = {
      find: cy
        .stub()
        .onFirstCall()
        .returns({
          toArray: cy.stub().resolves([incident_1]),
        }),
    };

    const reportsCollection = {
      find: cy
        .stub()
        .onFirstCall()
        .returns({
          toArray: cy.stub().resolves([report_1]),
        }),
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

    cy.wrap(lookupByUrl({ urls: ['https://report1.com/path?query'] })).then((result) => {
      expect(reportsCollection.find.firstCall.args[0]).to.deep.equal({
        url: { $regex: 'report1.com/path', $options: 'i' },
      });

      expect(incidentsCollection.find.firstCall.args[0]).to.deep.equal({ reports: 1 });

      expect(result).to.deep.equal({
        results: [
          {
            url: 'https://report1.com/path?query',
            reports: [
              {
                report_number: 1,
                title: 'Report 1',
                url: 'https://report1.com',
              },
            ],
            incidents: [
              {
                incident_id: 1,
                title: 'Title 1',
                permalink: 'https://incidentdatabase.ai/cite/1',
              },
            ],
          },
        ],
      });
    });
  });
});
