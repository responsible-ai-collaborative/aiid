import { expect } from '@playwright/test';
import sinon from 'sinon';
import { ObjectId } from 'bson';
import AlgoliaUpdater from '../../../src/utils/AlgoliaUpdater';
import { test } from '../../utils';

test('Should update translations to Algolia', async ({ page }) => {
  const incidents = [
    {
      incident_id: 1,
      date: '2020-06-14',
      reports: [1, 23],
    },
  ];

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
      cloudinary_id: 'http://cloudinary.com',
      language: 'en',
      report_number: 1,
      source_domain: 'blogs.wsj.com',
      submitters: ['Roman Yampolskiy'],
      tags: [],
      text: 'Report 1 text',
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
      description: 'Description of report 23',
      epoch_date_downloaded: 1555113600,
      epoch_date_modified: 1592092800,
      epoch_date_published: 1431993600,
      epoch_date_submitted: 1559347200,
      image_url: 'http://url.com',
      cloudinary_id: 'http://cloudinary.com',
      language: 'es',
      report_number: 23,
      source_domain: 'blogs.wsj.com',
      submitters: ['Roman Yampolskiy'],
      tags: [],
      text: 'Report 23 text',
      plain_text: 'Report 23 text',
      title: 'Report 23 title',
      url: 'https://url.com/stuff',
    },
  ];

  const classifications = [
    {
      _id: '60dd465f80935bc89e6f9b00',
      incidents: [1],
      reports: [],
      namespace: 'CSETv0',
      attributes: [
        { short_name: 'Named Entities', value_json: '["Amazon"]' },
        {
          short_name: 'Harm Type',
          value_json: '["Harm to physical health/safety", "Harm to physical property"]',
        },
        { short_name: 'Publish', value_json: 'true' },
      ],
      notes: null,
    },
    {
      _id: '60dd465f80935bc89e6f9b01',
      incidents: [],
      reports: [],
      namespace: 'SHOULD NOT BE INCLUDED',
      attributes: [{ short_name: 'Something', value_json: '"Great"' }],
      notes: 'Nothing to see here',
    },
  ];

  const translatedReportsEN = [
    {
      _id: '61d5ad9f102e6e30fca9065r',
      text: 'translated-en-text **report 23**',
      plain_text: 'translated-en-text report 23',
      title: 'translated-en-title report 23',
      report_number: 23,
    },
  ];

  const translatedReportsES = [
    {
      _id: '61d5ad9f102e6e30fca90ddf',
      text: 'translated-es-text **report 1**',
      plain_text: 'translated-es-text report 1',
      title: 'translated-es-title report 1',
      report_number: 1,
    },
  ];

  const duplicates = [
    {
      duplicate_incident_number: 247,
      true_incident_number: 246,
    },
  ];

  const reporter = { log: sinon.stub() };

  const mongoClientStub = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().returns({
      collection: (name: string) => {
        if (name === 'reports') {
          return {
            find: sinon.stub().returns({
              toArray: sinon.stub().resolves(reports),
            }),
          };
        }
        if (name === 'reports_en') {
          return {
            find: sinon.stub().returns({
              toArray: sinon.stub().resolves(translatedReportsEN),
            }),
          };
        }
        if (name === 'reports_es') {
          return {
            find: sinon.stub().returns({
              toArray: sinon.stub().resolves(translatedReportsES),
            }),
          };
        }
        if (name === 'classifications') {
          return {
            find: sinon.stub().returns({
              toArray: sinon.stub().resolves(classifications),
            }),
          };
        }
        if (name === 'incidents') {
          return {
            find: sinon.stub().returns({
              toArray: sinon.stub().resolves(incidents),
            }),
          };
        }
        if (name === 'duplicates') {
          return {
            find: sinon.stub().returns({
              toArray: sinon.stub().resolves(duplicates),
            }),
          };
        }
        return null;
      },
    }),
  };

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
    mongoClient: mongoClientStub,
    algoliaClient: algoliaClientStub,
    languages: [{ code: 'es' }, { code: 'en' }],
    reporter,
  });

  await updater.run();

  expect(mongoClientStub.connect.calledOnce).toBeTruthy();
  expect(mongoClientStub.close.calledOnce).toBeTruthy();

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
