import { ObjectId } from 'bson';
import { test } from '../../utils';
import Translator from '../../../src/scripts/reportTranslator';
import sinon from 'sinon';

const reports = [
  {
    _id: new ObjectId('60dd465f80935bc89e6f9b01'),
    report_number: 1,
    title: 'Report 1 title',
    text: 'Report 1 **text**',
    plain_text: 'Report 1 text',
    language: 'en',
    authors: ['Jhon Doe'],
    date_downloaded: '2019-04-13',
    date_modified: '2020-06-14',
    date_published: '2015-05-19',
    date_submitted: '2019-06-01',
    description: 'Description of report 1',
    epoch_date_modified: 1592092800,
    epoch_date_published: 1431993600,
    epoch_date_submitted: 1559347200,
    image_url: 'http://url.com',
    source_domain: 'blogs.wsj.com',
    submitters: ['Jason Smith'],
    tags: [],
    url: 'https://url.com/stuff',
  },
  {
    _id: new ObjectId('60dd465f80935bc89e6f9b02'),
    report_number: 2,
    title: 'Título del reporte 2',
    text: 'Reporte 2 **texto**',
    plain_text: 'Reporte 2 texto',
    language: 'es',
    authors: ['Juan Perez'],
    date_downloaded: '2019-04-13',
    date_modified: '2020-06-14',
    date_published: '2015-05-19',
    date_submitted: '2020-06-01',
    description: 'Descripción del reporte 2',
    epoch_date_modified: 1592092800,
    epoch_date_published: 1431993600,
    epoch_date_submitted: 1559347200,
    image_url: 'http://url.com',
    source_domain: 'blogs.wsj.com',
    submitters: ['Ramon Gomez'],
    tags: [],
    url: 'https://url.com/stuff',
  },
  {
    _id: new ObjectId('60dd465f80935bc89e6f9b03'),
    report_number: 3,
    title: 'Título del reporte 3',
    text: 'Reporte 3 **texto**',
    plain_text: 'Reporte 3 texto',
    language: 'es',
    authors: ['Juan Perez'],
    date_downloaded: '2019-04-13',
    date_modified: '2020-06-14',
    date_published: '2015-05-19',
    date_submitted: '2021-06-01',
    description: 'Descripción del reporte 3',
    epoch_date_modified: 1592092800,
    epoch_date_published: 1431993600,
    epoch_date_submitted: 1559347200,
    image_url: 'http://url.com',
    source_domain: 'blogs.wsj.com',
    submitters: ['Ramon Gomez'],
    tags: [],
    url: 'https://url.com/stuff',
  },
];

// mock new Date()
const mockDate = new Date('2025-01-01');
const dateStub = sinon.stub(global, 'Date') as any;
dateStub.returns(mockDate);
dateStub.now = () => mockDate.getTime();
dateStub.parse = () => mockDate.getTime();

test('Report Translations - Should translate languages only if report language differs from target language', async ({ page }) => {
  const translatedReports = [];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const reportsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(reports),
    }),
  };

  const reportsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReports),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
  };

  const mongoClient = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().callsFake((dbName: string) => {
      if (dbName === 'aiidprod') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsCollection;
            return null;
          },
        };
      } else if (dbName === 'translations') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsTranslationsCollection;
            return null;
          },
        };
      } else {
        throw new Error(`Unexpected database name: ${dbName}`);
      }
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
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.calledThrice(translateClient.translate);
  sinon.assert.calledTwice(reportsTranslationsCollection.insertMany);
  sinon.assert.calledWith(reportsTranslationsCollection.insertMany, [
    {
      report_number: 2,
      text: 'test-en-Reporte 2 **texto**',
      title: 'test-en-Título del reporte 2',
      plain_text: 'test-en-Reporte 2 texto\n',
      language: 'en',
      dirty: undefined,
      created_at: new Date(),
    },
    {
      report_number: 3,
      text: 'test-en-Reporte 3 **texto**',
      title: 'test-en-Título del reporte 3',
      plain_text: 'test-en-Reporte 3 texto\n',
      language: 'en',
      dirty: undefined,
      created_at: new Date(),
    }
  ]);
  sinon.assert.calledWith(reportsTranslationsCollection.insertMany, [{
    report_number: 1,
    text: 'test-es-Report 1 **text**',
    title: 'test-es-Report 1 title',
    plain_text: 'test-es-Report 1 text\n',
    language: 'es',
    dirty: undefined,
    created_at: new Date(),
  }]);

  sinon.assert.calledOnce(mongoClient.close);
});

test("Report Translations - Shouldn't call Google's translate api and use translation placeholders if dryRun is true", async ({ page }) => {
  const translatedReports = [];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const reportsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(reports),
    }),
  };

  const reportsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReports),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
  };

  const mongoClient = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().callsFake((dbName: string) => {
      if (dbName === 'aiidprod') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsCollection;
            return null;
          },
        };
      } else if (dbName === 'translations') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsTranslationsCollection;
            return null;
          },
        };
      } else {
        throw new Error(`Unexpected database name: ${dbName}`);
      }
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
  
  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.notCalled(translateClient.translate);

  sinon.assert.calledTwice(reportsTranslationsCollection.insertMany);
  sinon.assert.calledWith(reportsTranslationsCollection.insertMany, [
    {
      report_number: 2,
      text: 'translated-en-Reporte 2 **texto**',
      title: 'translated-en-Título del reporte 2',
      plain_text: 'translated-en-Reporte 2 texto\n',
      language: 'en',
      dirty: undefined,
      created_at: new Date(),
    },
    {
      report_number: 3,
      text: 'translated-en-Reporte 3 **texto**',
      title: 'translated-en-Título del reporte 3',
      plain_text: 'translated-en-Reporte 3 texto\n',
      language: 'en',
      dirty: undefined,
      created_at: new Date(),
    }
  ]);
  sinon.assert.calledWith(reportsTranslationsCollection.insertMany, [{
    report_number: 1,
    text: 'translated-es-Report 1 **text**',
    title: 'translated-es-Report 1 title',
    plain_text: 'translated-es-Report 1 text\n',
    language: 'es',
    dirty: undefined,
    created_at: new Date(),
  }]);

  sinon.assert.calledOnce(mongoClient.close);
});

test('Report Translations - Should translate reports with submission date greater than an specific report submission date', async ({ page }) => {
  const submissionDateStart = '2021-01-01';

  const translatedReports = [];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const reportsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(reports.filter(r => r.date_submitted > submissionDateStart)),
    }),
  };

  const reportsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReports),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
  };

  const mongoClient = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().callsFake((dbName: string) => {
      if (dbName === 'aiidprod') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsCollection;
            return null;
          },
        };
      } else if (dbName === 'translations') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsTranslationsCollection;
            return null;
          },
        };
      } else {
        throw new Error(`Unexpected database name: ${dbName}`);
      }
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
    submissionDateStart: submissionDateStart,
  });

  await translator.run();
  
  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.calledWith(reportsCollection.find, { date_submitted: { $gte: new Date(submissionDateStart) } });
  sinon.assert.calledOnce(translateClient.translate);
  sinon.assert.calledOnce(reportsTranslationsCollection.insertMany);
  sinon.assert.calledWith(reportsTranslationsCollection.insertMany, [
    {
      report_number: 3,
      text: 'test-en-Reporte 3 **texto**',
      title: 'test-en-Título del reporte 3',
      plain_text: 'test-en-Reporte 3 texto\n',
      language: 'en',
      dirty: undefined,
      created_at: new Date(),
    }
  ]);

  sinon.assert.calledOnce(mongoClient.close);
});

test('Report Translations - Should not translate if the report was already translated', async ({ page }) => {
  const translatedReports = [
    {
      _id: '61d5ad9f102e6e30fca90ddf',
      report_number: 1,
      title: 'Título del reporte 1',
      text: 'Reporte 1 **texto**',
      plain_text: 'Reporte 1 texto',
      language: 'es',
    },
    {
      _id: '61d5ad9f102e6e30fca90dde',
      report_number: 2,
      title: 'Report 2 title',
      text: 'Report 2 **text**',
      plain_text: 'Report 2 text',
      language: 'en',
    },
    {
      _id: '61d5ad9f102e6e30fca90ddf',
      report_number: 3,
      title: 'Report 3 title',
      text: 'Report 3 **text**',
      plain_text: 'Report 3 text',
      language: 'en',
    },
  ];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const reportsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(reports),
    }),
  };

  const reportsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReports),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
  };

  const mongoClient = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().callsFake((dbName: string) => {
      if (dbName === 'aiidprod') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsCollection;
            return null;
          },
        };
      } else if (dbName === 'translations') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsTranslationsCollection;
            return null;
          },
        };
      } else {
        throw new Error(`Unexpected database name: ${dbName}`);
      }
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
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.notCalled(translateClient.translate);
  sinon.assert.notCalled(reportsTranslationsCollection.insertMany);
  sinon.assert.calledOnce(mongoClient.close);
});

test("Report Translations - Should not insert report translation if the Google's translate API returns empty translations", async ({ page }) => {
  const translatedReports = [];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const reportsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(reports),
    }),
  };

  const reportsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReports),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
  };

  const mongoClient = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().callsFake((dbName: string) => {
      if (dbName === 'aiidprod') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsCollection;
            return null;
          },
        };
      } else if (dbName === 'translations') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsTranslationsCollection;
            return null;
          },
        };
      } else {
        throw new Error(`Unexpected database name: ${dbName}`);
      }
    }),
  };

  // Mock Google Translate API to return empty translations only for the 'en' language
  const translateClient = {
    translate: sinon.stub().callsFake((payload, { to }) => {
      if(to === 'en') return [['', '']];
      return [payload.map((p: any) => `test-${to}-${p}`)];
    }
    ),
  };

  const translator = new Translator({
    mongoClient,
    translateClient,
    languages: [{ code: 'es' }, {code: 'en'}],
    reporter,
    dryRun: false,
  });

  await translator.run();
  
  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.calledThrice(translateClient.translate);
  sinon.assert.calledOnce(reportsTranslationsCollection.insertMany);
  sinon.assert.calledWith(reportsTranslationsCollection.insertMany, [{
    report_number: 1,
    text: 'test-es-Report 1 **text**',
    title: 'test-es-Report 1 title',
    plain_text: 'test-es-Report 1 text\n',
    language: 'es',
    dirty: undefined,
    created_at: new Date(),
  }]);
  sinon.assert.callCount(reporter.error, 4);
  sinon.assert.calledOnce(mongoClient.close);
});

test('Report Translations - Should translate dirty reports translations', async ({ page }) => {
  const translatedReports = [
    {
      report_number: 1,
      text: 'Texto del reporte desactualizado',
      title: 'Título del reporte desactualizado',
      plain_text: 'Texto del reporte desactualizado\n',
      language: 'es',
      dirty: true,
    }
  ];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const reportsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(reports),
    }),
  };

  const reportsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedReports),
    }),
    insertMany: sinon.stub().resolves({ insertedCount: 1 }),
    updateOne: sinon.stub().resolves(),
  };

  const mongoClient = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().callsFake((dbName: string) => {
      if (dbName === 'aiidprod') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsCollection;
            return null;
          },
        };
      } else if (dbName === 'translations') {
        return {
          collection: (name: string) => {
            if (name === 'reports') return reportsTranslationsCollection;
            return null;
          },
        };
      } else {
        throw new Error(`Unexpected database name: ${dbName}`);
      }
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
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.calledThrice(translateClient.translate);
  sinon.assert.calledOnce(reportsTranslationsCollection.insertMany);
  sinon.assert.calledWith(reportsTranslationsCollection.insertMany, [
    {
      report_number: 2,
      text: 'test-en-Reporte 2 **texto**',
      title: 'test-en-Título del reporte 2',
      plain_text: 'test-en-Reporte 2 texto\n',
      language: 'en',
      dirty: undefined,
      created_at: new Date(),
    },
    {
      report_number: 3,
      text: 'test-en-Reporte 3 **texto**',
      title: 'test-en-Título del reporte 3',
      plain_text: 'test-en-Reporte 3 texto\n',
      language: 'en',
      dirty: undefined,
      created_at: new Date(),
    }
  ]);
  sinon.assert.calledOnce(reportsTranslationsCollection.updateOne);
  sinon.assert.calledWith(reportsTranslationsCollection.updateOne, 
    { report_number: 1 },
    {
      $set: { 
        report_number: 1,
        text: 'test-es-Report 1 **text**',
        title: 'test-es-Report 1 title',
        plain_text: 'test-es-Report 1 text\n',
        language: 'es',
        dirty: false,
        created_at: new Date(),
      },
    }
  );

  sinon.assert.calledOnce(mongoClient.close);

});