import { ObjectId } from 'bson';
import { expect } from '@playwright/test';
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
    epoch_date_published: 1431993600,
    epoch_date_submitted: 1559347200,
    image_url: 'http://url.com',
    source_domain: 'blogs.wsj.com',
    submitters: ['Ramon Gomez'],
    tags: [],
    url: 'https://url.com/stuff',
  },
];

// mock new Date() for the duration of each test, so stored `created_at` values are predictable
const mockDate = new Date('2025-01-01');

let dateStub: any;

test.beforeEach(() => {
  dateStub = sinon.stub(global, 'Date') as any;
  dateStub.returns(mockDate);
  dateStub.now = () => mockDate.getTime();
  dateStub.parse = () => mockDate.getTime();
});

test.afterEach(() => {
  dateStub.restore();
});

type Translate = (payload: string[], options: { to: string }) => any;

const fakeTranslate: Translate = (payload, { to }) => [payload.map((p) => `test-${to}-${p}`)];

/**
 * Stubs the two collections the translator touches. The translations collection answers
 * `find` with the stored translations of the language being queried, as MongoDB would.
 */
const createMocks = ({
  reportDocs = reports,
  translatedReports = [] as any[],
  translate = fakeTranslate,
} = {}) => {
  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const reportsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(reportDocs),
    }),
  };

  const reportsTranslationsCollection = {
    find: sinon.stub().callsFake((query: any) => ({
      toArray: sinon
        .stub()
        .resolves(translatedReports.filter((t) => t.language === query.$and[0].language)),
    })),
    updateOne: sinon.stub().resolves({ upsertedCount: 1 }),
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
    translate: sinon.stub().callsFake(translate),
  };

  return {
    reporter,
    reportsCollection,
    reportsTranslationsCollection,
    mongoClient,
    translateClient,
  };
};

/** The document the translator is expected to upsert for `report` translated with `prefix` */
const storedTranslation = (
  report: (typeof reports)[number],
  language: string,
  prefix = 'test'
) => ({
  report_number: report.report_number,
  text: `${prefix}-${language}-${report.text}`,
  title: `${prefix}-${language}-${report.title}`,
  plain_text: `${prefix}-${language}-${report.plain_text}\n`,
  language,
  dirty: false,
  created_at: new Date(),
});

const upsert = (translation: ReturnType<typeof storedTranslation>) => [
  { report_number: translation.report_number, language: translation.language },
  { $set: translation },
  { upsert: true },
];

test('Report Translations - Should translate languages only if report language differs from target language', async () => {
  const {
    reporter,
    reportsCollection,
    reportsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks();

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.calledThrice(translateClient.translate);
  sinon.assert.calledThrice(reportsTranslationsCollection.updateOne);
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[0], 'es'))
  );
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[1], 'en'))
  );
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[2], 'en'))
  );

  sinon.assert.calledOnce(mongoClient.close);
});

test("Report Translations - Shouldn't call Google's translate api and use translation placeholders if dryRun is true", async () => {
  const {
    reporter,
    reportsCollection,
    reportsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks();

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: true,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.notCalled(translateClient.translate);

  sinon.assert.calledThrice(reportsTranslationsCollection.updateOne);
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[0], 'es', 'translated'))
  );
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[1], 'en', 'translated'))
  );
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[2], 'en', 'translated'))
  );

  sinon.assert.calledOnce(mongoClient.close);
});

test('Report Translations - Should translate reports with submission date greater than an specific report submission date', async () => {
  const submissionDateStart = '2021-01-01';

  const {
    reporter,
    reportsCollection,
    reportsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks({
    reportDocs: reports.filter((r) => r.date_submitted > submissionDateStart),
  });

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
    submissionDateStart: submissionDateStart,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.calledWith(reportsCollection.find, {
    date_submitted: { $gte: new Date(submissionDateStart) },
    tags: { $nin: ['variant:unreviewed', 'variant:rejected'] },
  });
  sinon.assert.calledOnce(translateClient.translate);
  sinon.assert.calledOnce(reportsTranslationsCollection.updateOne);
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[2], 'en'))
  );

  sinon.assert.calledOnce(mongoClient.close);
});

test('Report Translations - Should not translate if the report was already translated', async () => {
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

  const {
    reporter,
    reportsCollection,
    reportsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks({ translatedReports });

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.notCalled(translateClient.translate);
  sinon.assert.notCalled(reportsTranslationsCollection.updateOne);
  sinon.assert.calledOnce(mongoClient.close);
});

test("Report Translations - Should not insert report translation if the Google's translate API returns empty translations", async () => {
  // Mock Google Translate API to return empty translations only for the 'en' language
  const {
    reporter,
    reportsCollection,
    reportsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks({
    translate: (payload, { to }) => {
      if (to === 'en') return [['', '']];
      return [payload.map((p) => `test-${to}-${p}`)];
    },
  });

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.calledThrice(translateClient.translate);
  sinon.assert.calledOnce(reportsTranslationsCollection.updateOne);
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[0], 'es'))
  );
  sinon.assert.callCount(reporter.error, 4);
  sinon.assert.calledOnce(mongoClient.close);
});

test('Report Translations - Should translate dirty reports translations', async () => {
  const translatedReports = [
    {
      report_number: 1,
      text: 'Texto del reporte desactualizado',
      title: 'Título del reporte desactualizado',
      plain_text: 'Texto del reporte desactualizado\n',
      language: 'es',
      dirty: true,
    },
  ];

  const {
    reporter,
    reportsCollection,
    reportsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks({ translatedReports });

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(reportsCollection.find);
  sinon.assert.calledThrice(translateClient.translate);
  sinon.assert.calledThrice(reportsTranslationsCollection.updateOne);

  // The re-translation replaces the stored Spanish document and only that one: the filter
  // names the language, so a translation in another language is never overwritten.
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[0], 'es'))
  );
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[1], 'en'))
  );
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[2], 'en'))
  );

  sinon.assert.calledOnce(mongoClient.close);
});

test('Report Translations - Should re-translate a report once when any of its stored translations in a language is dirty', async () => {
  const translatedReports = [
    { report_number: 1, text: 'a', title: 'a', plain_text: 'a', language: 'es', dirty: false },
    { report_number: 1, text: 'b', title: 'b', plain_text: 'b', language: 'es', dirty: true },
    { report_number: 2, text: 'c', title: 'c', plain_text: 'c', language: 'en', dirty: false },
    { report_number: 3, text: 'd', title: 'd', plain_text: 'd', language: 'en', dirty: false },
  ];

  const { reporter, reportsTranslationsCollection, mongoClient, translateClient } = createMocks({
    translatedReports,
  });

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledOnce(translateClient.translate);
  sinon.assert.calledOnce(reportsTranslationsCollection.updateOne);
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[0], 'es'))
  );
});

test('Report Translations - Should store the translations that succeed when one fails, then fail the run', async () => {
  const { reporter, reportsTranslationsCollection, mongoClient, translateClient } = createMocks({
    translate: (payload, { to }) => {
      if (payload[0] === reports[1].text) {
        const error: any = new Error('Request payload size exceeds the limit');
        error.code = 400;
        throw error;
      }
      return [payload.map((p) => `test-${to}-${p}`)];
    },
  });

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
  });

  await expect(translator.run()).rejects.toThrow(/1 failed translations: report 2 \[en\]/);

  sinon.assert.calledThrice(translateClient.translate);
  sinon.assert.calledTwice(reportsTranslationsCollection.updateOne);
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[0], 'es'))
  );
  sinon.assert.calledWith(
    reportsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(reports[2], 'en'))
  );
  sinon.assert.calledWith(
    reporter.error,
    sinon.match(/Error translating report 2 to \[en\], 400 Request payload size exceeds the limit/)
  );
  sinon.assert.calledOnce(mongoClient.close);
});

test('Report Translations - Should refuse to run above the character budget before calling the translate API', async () => {
  const { reporter, reportsTranslationsCollection, mongoClient, translateClient } = createMocks();

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
    maxCharsPerRun: 10,
  });

  await expect(translator.run()).rejects.toThrow(
    /above the TRANSLATE_MAX_CHARS_PER_RUN limit of 10/
  );

  sinon.assert.notCalled(translateClient.translate);
  sinon.assert.notCalled(reportsTranslationsCollection.updateOne);
  sinon.assert.calledWith(reporter.error, sinon.match(/aborted before calling Google Translate/));
  sinon.assert.calledOnce(mongoClient.close);
});

test('Report Translations - Should read the character budget from TRANSLATE_MAX_CHARS_PER_RUN and default to two million', async () => {
  const { reporter, mongoClient, translateClient } = createMocks();

  const options = {
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    reporter,
    languages: [],
    dryRun: false,
  };

  expect(new Translator(options).maxCharsPerRun).toBe(2000000);
  expect(new Translator({ ...options, maxCharsPerRun: '25000000' }).maxCharsPerRun).toBe(25000000);
  expect(() => new Translator({ ...options, maxCharsPerRun: 'lots' })).toThrow(
    /Invalid TRANSLATE_MAX_CHARS_PER_RUN/
  );
});

test('Report Translations - Should not apply the character budget to dry runs', async () => {
  const { reporter, reportsTranslationsCollection, mongoClient, translateClient } = createMocks();

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: true,
    maxCharsPerRun: 1,
  });

  await translator.run();

  sinon.assert.notCalled(translateClient.translate);
  sinon.assert.calledThrice(reportsTranslationsCollection.updateOne);
});

test('Report Translations - Should skip reports with an empty title or text instead of sending them every run', async () => {
  const { reporter, reportsTranslationsCollection, mongoClient, translateClient } = createMocks({
    reportDocs: [{ ...reports[0], title: '' }, reports[1], reports[2]],
  });

  const translator = new Translator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledTwice(translateClient.translate);
  sinon.assert.calledTwice(reportsTranslationsCollection.updateOne);
  sinon.assert.neverCalledWith(reportsTranslationsCollection.updateOne, {
    report_number: 1,
    language: 'es',
  });
  sinon.assert.calledWith(
    reporter.warn,
    sinon.match(/Skipping report 1 for \[es\]: its title field is empty/)
  );
});
