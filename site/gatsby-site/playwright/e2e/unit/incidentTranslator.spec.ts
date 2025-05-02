import { ObjectId } from 'bson';
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

test('Incident Translations - Should translate all incidents', async ({ page }) => {
  // mock new Date()
  const mockDate = new Date('2025-01-01');
  const dateStub = sinon.stub(global, 'Date') as any;
  dateStub.returns(mockDate);
  dateStub.now = () => mockDate.getTime();
  dateStub.parse = () => mockDate.getTime();

  const translatedIncidents = [];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const incidentsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(incidents),
    }),
  };

  const incidentsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedIncidents),
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
    translate: sinon.stub().callsFake((payload, { to }) => [payload.map((p: string) => `test-${to}-${p}`)]),
  };

  const translator = new IncidentTranslator({
    mongoClient,
    translateClient,
    languages: ['es', 'fr'],
    reporter,
    dryRun: false,
  });

  await translator.run();
  
  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.callCount(translateClient.translate, 6);
  sinon.assert.calledTwice(incidentsTranslationsCollection.insertMany);
  sinon.assert.calledWith(incidentsTranslationsCollection.insertMany, [
    {
      incident_id: 1,
      title: 'test-es-Incident 1 title',
      description: 'test-es-Description of incident 1',
      language: 'es',
      created_at: new Date(),
    },
    {
      incident_id: 2,
      title: 'test-es-Incident 2 title',
      description: 'test-es-Description of incident 2',
      language: 'es',
      created_at: new Date(),
    },
    {
      incident_id: 3,
      title: 'test-es-Incident 3 title',
      description: 'test-es-Description of incident 3',
      language: 'es',
      created_at: new Date(),
    },
  ]);
  sinon.assert.calledWith(incidentsTranslationsCollection.insertMany, [
    {
      incident_id: 1,
      title: 'test-fr-Incident 1 title',
      description: 'test-fr-Description of incident 1',
      language: 'fr',
      created_at: new Date(),
    }, {
      incident_id: 2,
      title: 'test-fr-Incident 2 title',
      description: 'test-fr-Description of incident 2',
      language: 'fr',
      created_at: new Date(),
    },
    {
      incident_id: 3,
      title: 'test-fr-Incident 3 title',
      description: 'test-fr-Description of incident 3',
      language: 'fr',
      created_at: new Date(),
    },
  ]);
  sinon.assert.calledOnce(mongoClient.close);

  dateStub.restore();
});

test("Incident Translations - Shouldn't call Google's translate api and use translation placeholders if dryRun is true", async ({ page }) => {
  // mock new Date()
  const mockDate = new Date('2025-01-01');
  const dateStub = sinon.stub(global, 'Date') as any;
  dateStub.returns(mockDate);
  dateStub.now = () => mockDate.getTime();
  dateStub.parse = () => mockDate.getTime();

  const translatedIncidents = [];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const incidentsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(incidents),
    }),
  };

  const incidentsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedIncidents),
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
    translate: sinon.stub().callsFake((payload, { to }) => [payload.map((p: string) => `test-${to}-${p}`)]),
  };

  const translator = new IncidentTranslator({
    mongoClient,
    translateClient,
    languages: ['es', 'fr'],
    reporter,
    dryRun: true,
  });

  await translator.run();
  
  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.notCalled(translateClient.translate);
  sinon.assert.calledTwice(incidentsTranslationsCollection.insertMany);
  sinon.assert.calledWith(incidentsTranslationsCollection.insertMany, [
    {
      incident_id: 1,
      title: 'translated-es-Incident 1 title',
      description: 'translated-es-Description of incident 1',
      language: 'es',
      created_at: new Date(),
    },
    {
      incident_id: 2,
      title: 'translated-es-Incident 2 title',
      description: 'translated-es-Description of incident 2',
      language: 'es',
      created_at: new Date(),
    },
    {
      incident_id: 3,
      title: 'translated-es-Incident 3 title',
      description: 'translated-es-Description of incident 3',
      language: 'es',
      created_at: new Date(),
    }
  ]);
  sinon.assert.calledWith(incidentsTranslationsCollection.insertMany, [
    {
      incident_id: 1,
      title: 'translated-fr-Incident 1 title',
      description: 'translated-fr-Description of incident 1',
      language: 'fr',
      created_at: new Date(),
    }, {
      incident_id: 2,
      title: 'translated-fr-Incident 2 title',
      description: 'translated-fr-Description of incident 2',
      language: 'fr',
      created_at: new Date(),
    },
    {
      incident_id: 3,
      title: 'translated-fr-Incident 3 title',
      description: 'translated-fr-Description of incident 3',
      language: 'fr',
      created_at: new Date(),
    },
  ]);
  sinon.assert.calledOnce(mongoClient.close);
  dateStub.restore();
});

test('Incident Translations - Should only translate incidents with creation date greater than specified date', async ({ page }) => {
  const creationDateStart = '2021-01-01';

  const mockDate = new Date(creationDateStart);
  const dateStub = sinon.stub(global, 'Date') as any;
  dateStub.returns(mockDate);
  dateStub.now = () => mockDate.getTime();
  dateStub.parse = () => mockDate.getTime();

  const translatedIncidents = [];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const incidentsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(incidents.filter(r => r.created_at > new Date(creationDateStart))),
    }),
  };

  const incidentsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedIncidents),
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
    translate: sinon.stub().callsFake((payload, { to }) => [payload.map((p: string) => `test-${to}-${p}`)]),
  };

  const translator = new IncidentTranslator({
    mongoClient,
    translateClient,
    languages: ['es', 'fr'],
    reporter,
    dryRun: false,
    creationDateStart,
  });

  await translator.run();
  
  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.calledWith(incidentsCollection.find, { created_at: { $gte: new Date(creationDateStart) } });
  sinon.assert.calledTwice(translateClient.translate);
  sinon.assert.calledTwice(incidentsTranslationsCollection.insertMany);
  sinon.assert.calledWith(incidentsTranslationsCollection.insertMany, [
    {
      incident_id: 3,
      title: 'test-es-Incident 3 title',
      description: 'test-es-Description of incident 3',
      language: 'es',
      created_at: new Date(),
    }
  ]);
  sinon.assert.calledWith(incidentsTranslationsCollection.insertMany, [
    {
      incident_id: 3,
      title: 'test-fr-Incident 3 title',
      description: 'test-fr-Description of incident 3',
      language: 'fr',
      created_at: new Date(),
    }
  ]);
  sinon.assert.calledOnce(mongoClient.close);
});

test('Incident Translations - Should not translate if the incident was already translated', async ({ page }) => {
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
      title: 'Report 2 title',
      description: 'Description of incident 2',
      language: 'en',
      created_at: new Date(),
    },
    {
      incident_id: 3,
      title: 'Report 3 title',
      description: 'Description of incident 3',
      language: 'en',
      created_at: new Date(),
    },
  ];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const incidentsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(incidents),
    }),
  };

  const incidentsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedIncidents),
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
    translate: sinon.stub().callsFake((payload, { to }) => [payload.map((p: string) => `test-${to}-${p}`)]),
  };

  const translator = new IncidentTranslator({
    mongoClient,
    translateClient,
    languages: ['es', 'en'],
    reporter,
    dryRun: false,
  });

  await translator.run();
  
  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.notCalled(translateClient.translate);
  sinon.assert.notCalled(incidentsTranslationsCollection.insertMany);
  sinon.assert.calledOnce(mongoClient.close);
});

test("Incident Translations - Should not insert incident translation if the Google's translate API returns empty translations", async ({ page }) => {
  const translatedIncidents = [];

  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const incidentsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(incidents),
    }),
  };

  const incidentsTranslationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(translatedIncidents),
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
    translate: sinon.stub().callsFake((payload, { to }) => {
      if(to === 'es') return [['', '']];
      return [payload.map((p: string) => `test-${to}-${p}`)];
    }),
  };

  const translator = new IncidentTranslator({
    mongoClient,
    translateClient,
    languages: ['es', 'fr'],
    reporter,
    dryRun: false,
  });

  await translator.run();
  
  sinon.assert.calledOnce(mongoClient.connect);
  sinon.assert.calledOnce(incidentsCollection.find);
  sinon.assert.callCount(translateClient.translate, 6);
  sinon.assert.calledOnce(incidentsTranslationsCollection.insertMany);
  sinon.assert.calledWith(incidentsTranslationsCollection.insertMany, [
    {
      incident_id: 1,
      title: 'test-fr-Incident 1 title',
      description: 'test-fr-Description of incident 1',
      language: 'fr',
      created_at: new Date(),
    },
    {
      incident_id: 2,
      title: 'test-fr-Incident 2 title',
      description: 'test-fr-Description of incident 2',
      language: 'fr',
      created_at: new Date(),
    },
    {
      incident_id: 3,
      title: 'test-fr-Incident 3 title',
      description: 'test-fr-Description of incident 3',
      language: 'fr',
      created_at: new Date(),
    },
  ]);
  sinon.assert.callCount(reporter.error, 6);
  sinon.assert.calledOnce(mongoClient.close);
}); 