import { ObjectId } from 'bson';
import { expect } from '@playwright/test';
import { test } from '../../utils';
import IncidentTranslator from '../../../src/scripts/incidentTranslator';
import sinon from 'sinon';

const incidents = [
  {
    _id: new ObjectId('60dd465f80935bc89e6f9b01'),
    incident_id: 1,
    title: 'Incident 1 title',
    description: 'Description of incident 1',
    created_at: new Date('2019-06-01'),
  },
  {
    _id: new ObjectId('60dd465f80935bc89e6f9b02'),
    incident_id: 2,
    title: 'Incident 2 title',
    description: 'Description of incident 2',
    created_at: new Date('2020-06-01'),
  },
  {
    _id: new ObjectId('60dd465f80935bc89e6f9b03'),
    incident_id: 3,
    title: 'Incident 3 title',
    description: 'Description of incident 3',
    created_at: new Date('2021-06-01'),
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
  incidentDocs = incidents,
  translatedIncidents = [] as any[],
  translate = fakeTranslate,
} = {}) => {
  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const incidentsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(incidentDocs),
    }),
  };

  const incidentsTranslationsCollection = {
    find: sinon.stub().callsFake((query: any) => ({
      toArray: sinon
        .stub()
        .resolves(translatedIncidents.filter((t) => t.language === query.$and[0].language)),
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
            if (name === 'incidents') return incidentsCollection;
            return null;
          },
        };
      } else if (dbName === 'translations') {
        return {
          collection: (name: string) => {
            if (name === 'incidents') return incidentsTranslationsCollection;
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
    incidentsCollection,
    incidentsTranslationsCollection,
    mongoClient,
    translateClient,
  };
};

/** The document the translator is expected to upsert for `incident` translated with `prefix` */
const storedTranslation = (
  incident: (typeof incidents)[number],
  language: string,
  prefix = 'test'
) => ({
  incident_id: incident.incident_id,
  language,
  created_at: new Date(),
  dirty: false,
  title: `${prefix}-${language}-${incident.title}`,
  description: `${prefix}-${language}-${incident.description}`,
});

const upsert = (translation: ReturnType<typeof storedTranslation>) => [
  { incident_id: translation.incident_id, language: translation.language },
  { $set: translation },
  { upsert: true },
];

test('Incident Translations - Should translate all incidents', async () => {
  const {
    reporter,
    incidentsCollection,
    incidentsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks();

  const translator = new IncidentTranslator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: ['es', 'fr'],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.callCount(translateClient.translate, 6);
  sinon.assert.callCount(incidentsTranslationsCollection.updateOne, 6);

  for (const incident of incidents) {
    sinon.assert.calledWith(
      incidentsTranslationsCollection.updateOne,
      ...upsert(storedTranslation(incident, 'es'))
    );
    sinon.assert.calledWith(
      incidentsTranslationsCollection.updateOne,
      ...upsert(storedTranslation(incident, 'fr'))
    );
  }

  sinon.assert.calledOnce(mongoClient.close);
});

test("Incident Translations - Shouldn't call Google's translate api and use translation placeholders if dryRun is true", async () => {
  const {
    reporter,
    incidentsCollection,
    incidentsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks();

  const translator = new IncidentTranslator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: ['es', 'fr'],
    reporter,
    dryRun: true,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.notCalled(translateClient.translate);
  sinon.assert.callCount(incidentsTranslationsCollection.updateOne, 6);

  for (const incident of incidents) {
    sinon.assert.calledWith(
      incidentsTranslationsCollection.updateOne,
      ...upsert(storedTranslation(incident, 'es', 'translated'))
    );
    sinon.assert.calledWith(
      incidentsTranslationsCollection.updateOne,
      ...upsert(storedTranslation(incident, 'fr', 'translated'))
    );
  }

  sinon.assert.calledOnce(mongoClient.close);
});

test('Incident Translations - Should only translate incidents with creation date greater than specified date', async () => {
  const creationDateStart = '2021-01-01';

  const {
    reporter,
    incidentsCollection,
    incidentsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks({
    // `Date` is stubbed while the test runs, so compare against the real timestamp
    incidentDocs: incidents.filter((r) => r.created_at.getTime() > 1609459200000),
  });

  const translator = new IncidentTranslator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: ['es', 'fr'],
    reporter,
    dryRun: false,
    creationDateStart,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.calledWith(incidentsCollection.find, {
    created_at: { $gte: new Date(creationDateStart) },
  });
  sinon.assert.calledTwice(translateClient.translate);
  sinon.assert.calledTwice(incidentsTranslationsCollection.updateOne);
  sinon.assert.calledWith(
    incidentsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(incidents[2], 'es'))
  );
  sinon.assert.calledWith(
    incidentsTranslationsCollection.updateOne,
    ...upsert(storedTranslation(incidents[2], 'fr'))
  );
  sinon.assert.calledOnce(mongoClient.close);
});

test('Incident Translations - Should not translate if the incident was already translated', async () => {
  const translatedIncidents = [
    {
      incident_id: 1,
      title: 'Título del incidente 1',
      description: 'Descripción del incidente 1',
      language: 'es',
      created_at: new Date(),
    },
    {
      incident_id: 2,
      title: 'Título del incidente 2',
      description: 'Descripción del incidente 2',
      language: 'es',
      created_at: new Date(),
    },
    {
      incident_id: 3,
      title: 'Título del incidente 3',
      description: 'Descripción del incidente 3',
      language: 'es',
      created_at: new Date(),
    },
  ];

  const {
    reporter,
    incidentsCollection,
    incidentsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks({ translatedIncidents });

  const translator = new IncidentTranslator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: ['es'],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.notCalled(translateClient.translate);
  sinon.assert.notCalled(incidentsTranslationsCollection.updateOne);
  sinon.assert.calledOnce(mongoClient.close);
});

test("Incident Translations - Should not insert incident translation if the Google's translate API returns empty translations", async () => {
  const {
    reporter,
    incidentsCollection,
    incidentsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks({
    translate: (payload, { to }) => {
      if (to === 'es') return [['', '']];
      return [payload.map((p) => `test-${to}-${p}`)];
    },
  });

  const translator = new IncidentTranslator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: ['es', 'fr'],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.callCount(translateClient.translate, 6);
  sinon.assert.calledThrice(incidentsTranslationsCollection.updateOne);

  for (const incident of incidents) {
    sinon.assert.calledWith(
      incidentsTranslationsCollection.updateOne,
      ...upsert(storedTranslation(incident, 'fr'))
    );
  }

  sinon.assert.callCount(reporter.error, 6);
  sinon.assert.calledOnce(mongoClient.close);
});

test('Incident Translations - Should translate dirty incidents translations', async () => {
  const translatedIncidents = [
    {
      incident_id: 2,
      language: 'es',
      title: 'Título del incidente 2 actualizado. Listo para volver a traducir.',
      description: 'Descripción del incidente 2 actualizado. Listo para volver a traducir.',
      created_at: new Date(2024, 0, 3),
      dirty: true,
    },
    {
      incident_id: 2,
      language: 'fr',
      title: "Titre de l'incident 2 mis à jour.",
      description: "Description de l'incident 2 mise à jour.",
      created_at: new Date(2024, 0, 3),
      dirty: true,
    },
  ];

  const {
    reporter,
    incidentsCollection,
    incidentsTranslationsCollection,
    mongoClient,
    translateClient,
  } = createMocks({ translatedIncidents });

  const translator = new IncidentTranslator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: ['es', 'fr'],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.callCount(translateClient.translate, 6);
  sinon.assert.callCount(incidentsTranslationsCollection.updateOne, 6);

  for (const incident of incidents) {
    sinon.assert.calledWith(
      incidentsTranslationsCollection.updateOne,
      ...upsert(storedTranslation(incident, 'es'))
    );
    sinon.assert.calledWith(
      incidentsTranslationsCollection.updateOne,
      ...upsert(storedTranslation(incident, 'fr'))
    );
  }

  sinon.assert.calledOnce(mongoClient.close);
});

test('Incident Translations - Should store the translations that succeed when one fails, then fail the run', async () => {
  const { reporter, incidentsTranslationsCollection, mongoClient, translateClient } = createMocks({
    translate: (payload, { to }) => {
      if (to === 'fr' && payload[0] === incidents[1].title) {
        throw new Error('Backend Error');
      }
      return [payload.map((p) => `test-${to}-${p}`)];
    },
  });

  const translator = new IncidentTranslator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: ['es', 'fr'],
    reporter,
    dryRun: false,
  });

  await expect(translator.run()).rejects.toThrow(/1 failed translations: incident 2 \[fr\]/);

  sinon.assert.callCount(translateClient.translate, 6);
  sinon.assert.callCount(incidentsTranslationsCollection.updateOne, 5);
  sinon.assert.neverCalledWith(incidentsTranslationsCollection.updateOne, {
    incident_id: 2,
    language: 'fr',
  });
  sinon.assert.calledWith(
    reporter.error,
    sinon.match(/Error translating incident 2 to \[fr\], Backend Error/)
  );
  sinon.assert.calledOnce(mongoClient.close);
});

test('Incident Translations - Should refuse to run above the character budget before calling the translate API', async () => {
  const { reporter, incidentsTranslationsCollection, mongoClient, translateClient } = createMocks();

  const translator = new IncidentTranslator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: ['es', 'fr'],
    reporter,
    dryRun: false,
    maxCharsPerRun: 10,
  });

  await expect(translator.run()).rejects.toThrow(
    /above the TRANSLATE_MAX_CHARS_PER_RUN limit of 10/
  );

  sinon.assert.notCalled(translateClient.translate);
  sinon.assert.notCalled(incidentsTranslationsCollection.updateOne);
  sinon.assert.calledOnce(mongoClient.close);
});

test('Incident Translations - Should skip incidents with an empty title or description instead of sending them every run', async () => {
  const { reporter, incidentsTranslationsCollection, mongoClient, translateClient } = createMocks({
    incidentDocs: [{ ...incidents[0], description: '' }, incidents[1], incidents[2]],
  });

  const translator = new IncidentTranslator({
    mongoClient: mongoClient as any,
    translateClient: translateClient as any,
    languages: ['es'],
    reporter,
    dryRun: false,
  });

  await translator.run();

  sinon.assert.calledTwice(translateClient.translate);
  sinon.assert.calledTwice(incidentsTranslationsCollection.updateOne);
  sinon.assert.neverCalledWith(incidentsTranslationsCollection.updateOne, {
    incident_id: 1,
    language: 'es',
  });
  sinon.assert.calledWith(
    reporter.warn,
    sinon.match(/Skipping incident 1 for \[es\]: its description field is empty/)
  );
});
