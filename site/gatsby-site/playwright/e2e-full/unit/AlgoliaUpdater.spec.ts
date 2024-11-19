import { expect } from '@playwright/test';
import sinon from 'sinon';
import { ObjectId } from 'bson';
import AlgoliaUpdater from '../../../src/utils/AlgoliaUpdater';
import { test } from '../../utils';
import { MongoClient } from 'mongodb';
import config from '../../config';
import { init } from '../../memory-mongo';

test('Should update translations to Algolia', async ({ page }) => {

  init();

  const reporter = { log: sinon.stub() };

  const mongoClient = new MongoClient(config.MONGODB_CONNECTION_STRING);

  const esIndex = {
    replaceAllObjects: sinon.stub().resolves({ objectIDs: ['1', '2'] }),
    setSettings: sinon.stub().resolves({}),
    deleteBy: sinon.stub().resolves({}),
  };

  const enIndex = {
    replaceAllObjects: sinon.stub().resolves({ objectIDs: ['1', '2'] }),
    setSettings: sinon.stub().resolves({}),
    deleteBy: sinon.stub().resolves({}),
  };

  const esIndexReplica = {
    setSettings: sinon.stub().resolves({}),
  };

  const algoliaClientStub = {
    initIndex: sinon.stub().callsFake((indexName: string) => {
      if (indexName === 'instant_search-es') return esIndex;
      if (indexName === 'instant_search-en') return enIndex;

      if (indexName === 'instant_search-es-featured' || indexName === 'instant_search-en-featured') {
        return esIndexReplica;
      }

      if (
        [
          'instant_search-es_epoch_incident_date_desc',
          'instant_search-en_epoch_incident_date_desc',
          'instant_search-es_epoch_incident_date_asc',
          'instant_search-en_epoch_incident_date_asc',
          'instant_search-es_epoch_date_published_desc',
          'instant_search-en_epoch_date_published_desc',
          'instant_search-es_epoch_date_published_asc',
          'instant_search-en_epoch_date_published_asc',
          'instant_search-es_epoch_date_submitted_desc',
          'instant_search-en_epoch_date_submitted_desc',
          'instant_search-es_epoch_date_submitted_asc',
          'instant_search-en_epoch_date_submitted_asc',
        ].includes(indexName)
      ) {
        return esIndexReplica;
      }

      return null;
    }),
  };

  const updater = new AlgoliaUpdater({
    mongoClient: mongoClient,
    algoliaClient: algoliaClientStub,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
  });

  await updater.run();

  const enIndexResult = algoliaClientStub.initIndex('instant_search-en');
  expect(enIndexResult.replaceAllObjects.calledOnce).toBeTruthy();

  const replaceAllObjectsArgs = enIndexResult.replaceAllObjects.getCall(0).args[0];
  replaceAllObjectsArgs.forEach((entry) => {
    if (entry.incident_id) {
      expect(entry.incident_id).toBeDefined();
    }
  });

  const esIndexResult = algoliaClientStub.initIndex('instant_search-es');
  expect(esIndexResult.replaceAllObjects.calledOnce).toBeTruthy();
});
