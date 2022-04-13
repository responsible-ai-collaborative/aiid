const AlgoliaUpdater = require('../../src/utils/AlgoliaUpdater');

const Translator = require('../../src/utils/Translator');

const reports = [
  {
    _id: '1',
    authors: ['Alistair Barr'],
    date_downloaded: '2019-04-13',
    date_modified: '2020-06-14',
    date_published: '2015-05-19',
    date_submitted: '2019-06-01',
    description: 'Description of report 1',
    epoch_date_downloaded: 1555113600,
    epoch_date_modified: 1592092800,
    epoch_date_published: 1431993600,
    epoch_date_submitted: 1559347200,
    epoch_incident_date: 1431993600,
    image_url: 'http://url.com',
    incident_id: 1,
    language: 'en',
    ref_number: 0,
    report_number: 1,
    source_domain: 'blogs.wsj.com',
    submitters: (1)['Roman Yampolskiy'],
    tags: [],
    text: 'Report 1 text',
    title: 'Report 1 title',
    url: 'https://url.com/stuff',
  },
  {
    _id: '2',
    authors: ['Alistair Barr'],
    date_downloaded: '2019-04-13',
    date_modified: '2020-06-14',
    date_published: '2015-05-19',
    date_submitted: '2019-06-01',
    description: 'Description of report 2',
    epoch_date_downloaded: 1555113600,
    epoch_date_modified: 1592092800,
    epoch_date_published: 1431993600,
    epoch_date_submitted: 1559347200,
    epoch_incident_date: 1431993600,
    image_url: 'http://url.com',
    incident_id: 1,
    language: 'en',
    ref_number: 0,
    report_number: 2,
    source_domain: 'blogs.wsj.com',
    submitters: (1)['Roman Yampolskiy'],
    tags: [],
    text: 'Report 2 text',
    title: 'Report 2 title',
    url: 'https://url.com/stuff',
  },
];

const classifications = [
  {
    _id: '60dd465f80935bc89e6f9b00',
    incident_id: 1,
    namespace: 'CSET',
    classifications: {
      Annotator: '1',
      'Annotation Status': '6. Complete and final',
      Reviewer: '5',
      'Quality Control': false,
      'Full Description': 'On December 5, 2018, a robot punctured.',
      'Named Entities': ['Amazon'],
      'Harm Type': ['Harm to physical health/safety', 'Harm to physical property'],
      Publish: true,
    },
    notes: null,
  },
];

describe('Translations', () => {
  it('Should run translations process', () => {
    const translatedReportsEN = [
      {
        _id: '61d5ad9f102e6e30fca90ddf',
        text: 'translated-en-text report 1',
        title: 'translated-en-title report 1',
        report_number: 1,
      },
    ];

    const translatedReportsES = [
      {
        _id: '61d5ad9f102e6e30fca90ddf',
        text: 'translated-es-text report 2',
        title: 'translated-es-title report 2',
        report_number: 2,
      },
    ];

    const reporter = { log: cy.stub() };

    const reportsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(reports),
      }),
    };

    const reportsENCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(translatedReportsEN),
      }),
      insertMany: cy.stub().log(true).resolves({ insertedCount: 1 }),
    };

    const reportsESCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(translatedReportsES),
      }),
      insertMany: cy.stub().resolves({ insertedCount: 1 }),
    };

    const mongoClient = {
      connect: cy.stub(),
      close: cy.stub(),
      db: cy.stub().returns({
        collection: (() => {
          const stub = cy.stub();

          stub.withArgs('reports').returns(reportsCollection);
          stub.withArgs('incident_reports_en').returns(reportsENCollection);
          stub.withArgs('incident_reports_es').returns(reportsESCollection);

          return stub;
        })(),
      }),
    };

    const translateClient = {
      translate: cy.stub().callsFake((payload, { to }) => [payload.map((p) => `test-${to}-${p}`)]),
    };

    const translator = new Translator({
      mongoClient,
      translateClient,
      languages: [{ code: 'es' }, { code: 'en' }],
      reporter,
      dryRun: false,
    });

    cy.wrap(translator.run()).then(() => {
      expect(mongoClient.connect.callCount).to.eq(1);

      expect(reportsENCollection.insertMany).to.have.been.calledOnceWith([
        {
          report_number: 2,
          text: 'test-en-Report 2 text',
          title: 'test-en-Report 2 title',
        },
      ]);

      expect(reportsESCollection.insertMany).to.have.been.calledOnceWith([
        {
          report_number: 1,
          text: 'test-es-Report 1 text',
          title: 'test-es-Report 1 title',
        },
      ]);

      expect(mongoClient.close.callCount).to.eq(1);
    });
  });

  it("Shouldn't call Google's translate api if dryRun is true", () => {
    const translatedReportsEN = [
      {
        _id: '61d5ad9f102e6e30fca90ddf',
        text: 'translated-en-text report 1',
        title: 'translated-en-title report 1',
        report_number: 1,
      },
    ];

    const translatedReportsES = [
      {
        _id: '61d5ad9f102e6e30fca90ddf',
        text: 'translated-es-text report 2',
        title: 'translated-es-title report 2',
        report_number: 2,
      },
    ];

    const reporter = { log: cy.stub() };

    const reportsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(reports),
      }),
    };

    const reportsENCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(translatedReportsEN),
      }),
      insertMany: cy.stub().resolves({ insertedCount: 1 }),
    };

    const reportsESCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(translatedReportsES),
      }),
      insertMany: cy.stub().resolves({ insertedCount: 1 }),
    };

    const mongoClient = {
      connect: cy.stub(),
      close: cy.stub(),
      db: cy.stub().returns({
        collection: (() => {
          const stub = cy.stub();

          stub.withArgs('reports').returns(reportsCollection);
          stub.withArgs('incident_reports_en').returns(reportsENCollection);
          stub.withArgs('incident_reports_es').returns(reportsESCollection);

          return stub;
        })(),
      }),
    };

    const translateClient = {
      translate: cy
        .stub()
        .callsFake((payload, { to }) => [payload.map((p) => `translated-${to}-${p}`)]),
    };

    const translator = new Translator({
      mongoClient,
      translateClient,
      languages: [{ code: 'es' }, { code: 'en' }],
      reporter,
      dryRun: true,
    });

    cy.wrap(translator.run()).then(() => {
      expect(translateClient.translate.callCount).to.eq(0);
    });
  });

  it('Should update translations to Algolia', () => {
    const translatedReportsEN = [
      {
        _id: '61d5ad9f102e6e30fca90ddf',
        text: 'translated-en-text report 1',
        title: 'translated-en-title report 1',
        report_number: 1,
      },
      {
        _id: '61d5ad9f102e6e30fca9065r',
        text: 'translated-en-text report 2',
        title: 'translated-en-title report 2',
        report_number: 2,
      },
    ];

    const translatedReportsES = [
      {
        _id: '61d5ad9f102e6e30fca90ddf',
        text: 'translated-es-text report 1',
        title: 'translated-es-title report 1',
        report_number: 1,
      },
      {
        _id: '61d5ad9f102e6e30fca90876',
        text: 'translated-es-text report 2',
        title: 'translated-es-title report 2',
        report_number: 2,
      },
    ];

    const reporter = { log: cy.stub() };

    const classificationsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(classifications),
      }),
    };

    const reportsENCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(translatedReportsEN),
      }),
    };

    const reportsESCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(translatedReportsES),
      }),
    };

    const reportsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(reports),
      }),
    };

    const mongoClient = {
      connect: cy.stub(),
      close: cy.stub(),
      db: cy.stub().returns({
        collection: (() => {
          const stub = cy.stub();

          stub.withArgs('reports').returns(reportsCollection);
          stub.withArgs('classifications').returns(classificationsCollection);
          stub.withArgs('incident_reports_en').returns(reportsENCollection);
          stub.withArgs('incident_reports_es').returns(reportsESCollection);

          return stub;
        })(),
      }),
    };

    const esIndex = {
      saveObjects: cy.stub().resolves({ objectIDs: ['1', '2'] }),
      setSettings: cy.stub().resolves({}),
    };

    const enIndex = {
      saveObjects: cy.stub().resolves({ objectIDs: ['1', '2'] }),
      setSettings: cy.stub().resolves({}),
    };

    const algoliaClient = {
      initIndex: (() => {
        const stub = cy.stub();

        stub.withArgs('instant_search-es').returns(esIndex);
        stub.withArgs('instant_search-en').returns(enIndex);

        return stub;
      })(),
    };

    const updater = new AlgoliaUpdater({
      mongoClient,
      algoliaClient,
      languages: [{ code: 'es' }, { code: 'en' }],
      reporter,
    });

    cy.wrap(updater.run()).then(() => {
      expect(mongoClient.connect.callCount).to.eq(1);

      expect(enIndex.saveObjects).to.have.been.calledOnceWith(
        Cypress.sinon.match.hasNested(
          '0',
          Cypress.sinon.match({
            objectID: '1',
            text: 'translated-en-text report 1',
            title: 'translated-en-title report 1',
            incident_id: 1,
            classifications: [
              'CSET:Annotator:1',
              'CSET:Annotation Status:6. Complete and final',
              'CSET:Reviewer:5',
              'CSET:Quality Control:false',
              'CSET:Full Description:On December 5, 2018, a robot punctured.',
              'CSET:Named Entities:Amazon',
              'CSET:Harm Type:Harm to physical health/safety',
              'CSET:Harm Type:Harm to physical property',
              'CSET:Publish:true',
            ],
          })
        )
      );

      expect(enIndex.saveObjects).to.have.been.calledOnceWith(
        Cypress.sinon.match.hasNested(
          '1',
          Cypress.sinon.match({
            objectID: '2',
            text: 'translated-en-text report 2',
            title: 'translated-en-title report 2',
            incident_id: 1,
            classifications: [
              'CSET:Annotator:1',
              'CSET:Annotation Status:6. Complete and final',
              'CSET:Reviewer:5',
              'CSET:Quality Control:false',
              'CSET:Full Description:On December 5, 2018, a robot punctured.',
              'CSET:Named Entities:Amazon',
              'CSET:Harm Type:Harm to physical health/safety',
              'CSET:Harm Type:Harm to physical property',
              'CSET:Publish:true',
            ],
          })
        )
      );

      expect(esIndex.saveObjects).to.have.been.calledOnceWith(
        Cypress.sinon.match.hasNested(
          '0',
          Cypress.sinon.match({
            objectID: '1',
            text: 'translated-es-text report 1',
            title: 'translated-es-title report 1',
            incident_id: 1,
            classifications: [
              'CSET:Annotator:1',
              'CSET:Annotation Status:6. Complete and final',
              'CSET:Reviewer:5',
              'CSET:Quality Control:false',
              'CSET:Full Description:On December 5, 2018, a robot punctured.',
              'CSET:Named Entities:Amazon',
              'CSET:Harm Type:Harm to physical health/safety',
              'CSET:Harm Type:Harm to physical property',
              'CSET:Publish:true',
            ],
          })
        )
      );

      expect(esIndex.saveObjects).to.have.been.calledOnceWith(
        Cypress.sinon.match.hasNested(
          '1',
          Cypress.sinon.match({
            objectID: '2',
            text: 'translated-es-text report 2',
            title: 'translated-es-title report 2',
            incident_id: 1,
            classifications: [
              'CSET:Annotator:1',
              'CSET:Annotation Status:6. Complete and final',
              'CSET:Reviewer:5',
              'CSET:Quality Control:false',
              'CSET:Full Description:On December 5, 2018, a robot punctured.',
              'CSET:Named Entities:Amazon',
              'CSET:Harm Type:Harm to physical health/safety',
              'CSET:Harm Type:Harm to physical property',
              'CSET:Publish:true',
            ],
          })
        )
      );

      expect(mongoClient.close.callCount).to.eq(1);
    });
  });
});
