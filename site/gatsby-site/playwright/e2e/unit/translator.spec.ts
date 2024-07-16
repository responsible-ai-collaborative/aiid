import { ObjectId } from 'bson';
import { test } from '../../utils';
import Translator from '../../../src/utils/Translator';
import sinon from 'sinon';

const reports = [
  {
    _id: new ObjectId('60dd465f80935bc89e6f9b01'),
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
    _id: new ObjectId('60dd465f80935bc89e6f9b02'),
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

test('Translations - Should translate languages only if report language differs from target language', async ({ page }) => {
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

  const reporter = { log: sinon.stub() };

  const reportsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(reports),
    }),
  };

  const reportsENCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReportsEN),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
  };

  const reportsESCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReportsES),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
  };

  const mongoClient = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().returns({
      collection: (name: string) => {
        if (name === 'reports') return reportsCollection;
        if (name === 'reports_en') return reportsENCollection;
        if (name === 'reports_es') return reportsESCollection;
        return null;
      },
    }),
  };

  const translateClient = {
    translate: sinon.stub().callsFake((payload, { to }) => [payload.map((p: any) => `test-${to}-${p}`)]),
  };

  const translator = new Translator({
    mongoClient,
    translateClient,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
  });

  await translator.run();
  
  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsENCollection.insertMany);
  sinon.assert.calledWith(reportsENCollection.insertMany, [{
    report_number: 2,
    text: 'test-en-Report 2 **text**',
    title: 'test-en-Report 2 title',
    plain_text: 'test-en-Report 2 text\n',
  }]);
  sinon.assert.calledOnce(reportsESCollection.insertMany);
  sinon.assert.calledWith(reportsESCollection.insertMany, [{
    report_number: 1,
    text: 'test-es-Report 1 **text**',
    title: 'test-es-Report 1 title',
    plain_text: 'test-es-Report 1 text\n',
  }]);
  sinon.assert.calledOnce(mongoClient.close);
});

test("Translations - Shouldn't call Google's translate api if dryRun is true", async ({ page }) => {
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

  const reporter = { log: sinon.stub() };

  const reportsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(reports),
    }),
  };

  const reportsENCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReportsEN),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
  };

  const reportsESCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReportsES),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
  };

  const mongoClient = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().returns({
      collection: (name: string) => {
        if (name === 'reports') return reportsCollection;
        if (name === 'reports_en') return reportsENCollection;
        if (name === 'reports_es') return reportsESCollection;
        return null;
      },
    }),
  };

  const translateClient = {
    translate: sinon.stub().callsFake((payload, { to }) => [payload.map((p: any) => `translated-${to}-${p}`)]),
  };

  const translator = new Translator({
    mongoClient,
    translateClient,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: true,
  });

  await translator.run();
  
  sinon.assert.notCalled(translateClient.translate);
});
