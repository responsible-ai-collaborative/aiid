const { ObjectID } = require('bson');

const Translator = require('../../../src/utils/Translator');

const reports = [
  {
    _id: new ObjectID('60dd465f80935bc89e6f9b01'),
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
    image_url: 'http://url.com',
    language: 'en',
    report_number: 1,
    source_domain: 'blogs.wsj.com',
    submitters: ['Roman Yampolskiy'],
    tags: [],
    text: 'Report 1 **text**',
    plain_text: 'Report 1 text',
    title: 'Report 1 title',
    url: 'https://url.com/stuff',
  },
  {
    _id: new ObjectID('60dd465f80935bc89e6f9b02'),
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
    image_url: 'http://url.com',
    language: 'es',
    report_number: 2,
    source_domain: 'blogs.wsj.com',
    submitters: ['Roman Yampolskiy'],
    tags: [],
    text: 'Report 2 **text**',
    plain_text: 'Report 2 text',
    title: 'Report 2 title',
    url: 'https://url.com/stuff',
  },
];

describe('Translations', () => {
  it('Should translate languages only if report language differs from target language', () => {
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
          stub.withArgs('reports_en').returns(reportsENCollection);
          stub.withArgs('reports_es').returns(reportsESCollection);

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

      expect(reportsENCollection.insertMany.callCount).to.eq(1);

      expect(reportsENCollection.insertMany.firstCall.args[0][0]).to.deep.equal({
        report_number: 2,
        text: 'test-en-Report 2 **text**',
        title: 'test-en-Report 2 title',
        plain_text: 'test-en-Report 2 text\n',
      });

      expect(reportsESCollection.insertMany.callCount).to.eq(1);

      expect(reportsESCollection.insertMany.firstCall.args[0][0]).to.deep.equal({
        report_number: 1,
        text: 'test-es-Report 1 **text**',
        title: 'test-es-Report 1 title',
        plain_text: 'test-es-Report 1 text\n',
      });

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
          stub.withArgs('reports_en').returns(reportsENCollection);
          stub.withArgs('reports_es').returns(reportsESCollection);

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
});
