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
    text: 'Rest text',
    title: 'Report Title 1',
    url: 'https://url.com/stuff',
  },
  {
    _id: '2',
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
    report_number: 2,
    source_domain: 'blogs.wsj.com',
    submitters: (1)['Roman Yampolskiy'],
    tags: [],
    text: 'Rest text',
    title: 'Report Title 2',
    url: 'https://url.com/stuff',
  },
];

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

describe('Translations', () => {
  it('Should run translations process', () => {
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
      translate: cy.stub().resolves([['Translated text', 'Translated title']]),
    };

    const translator = new Translator({
      mongoClient,
      translateClient,
      languages: [{ code: 'es' }, { code: 'en' }],
      reporter,
    });

    translator.run().then(() => {
      expect(mongoClient.connect.callCount).to.eq(1);

      expect(reportsENCollection.insertMany).to.have.been.calledOnceWith([
        {
          report_number: 2,
          text: 'Translated text',
          title: 'Translated title',
        },
      ]);

      expect(reportsESCollection.insertMany).to.have.been.calledOnceWith([
        {
          report_number: 1,
          text: 'Translated text',
          title: 'Translated title',
        },
      ]);

      expect(mongoClient.close.callCount).to.eq(1);
    });
  });
});
