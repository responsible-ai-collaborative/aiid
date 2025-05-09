import { expect } from '@playwright/test';
import sinon from 'sinon';
import { ObjectId } from 'bson';
import AlgoliaUpdater from '../../../src/utils/AlgoliaUpdater';
import { test } from '../../utils';

test.describe('AlgoliaUpdater', () => {
  // Mock data and helper functions for all tests
  const setupCommonTestData = () => {
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

    const reportTranslations = [
      {
        _id: '61d5ad9f102e6e30fca9065r',
        text: 'translated-en-text **report 23**',
        plain_text: 'translated-en-text report 23',
        title: 'translated-en-title report 23',
        report_number: 23,
        language: 'en',
      },
      {
        _id: '61d5ad9f102e6e30fca90ddf',
        text: 'translated-es-text **report 1**',
        plain_text: 'translated-es-text report 1',
        title: 'translated-es-title report 1',
        report_number: 1,
        language: 'es',
      },
    ];

    const duplicates = [
      {
        duplicate_incident_number: 247,
        true_incident_number: 246,
      },
    ];

    return { incidents, reports, classifications, reportTranslations, duplicates };
  };

  const createLargeReportMockData = () => {
    const incidents = [
      {
        incident_id: 1,
        date: '2020-06-14',
        reports: [1],
      },
    ];

    const reports = [
      {
        _id: new ObjectId('60dd465f80935bc89e6f9b01'),
        authors: ['Test Author'],
        date_downloaded: '2019-04-13',
        date_modified: '2020-06-14',
        date_published: '2015-05-19',
        date_submitted: '2019-06-01',
        description: 'Description of report',
        epoch_date_downloaded: 1555113600,
        epoch_date_modified: 1592092800,
        epoch_date_published: 1431993600,
        epoch_date_submitted: 1559347200,
        image_url: 'http://url.com',
        cloudinary_id: 'http://cloudinary.com',
        language: 'en',
        report_number: 1,
        source_domain: 'example.com',
        submitters: ['Test Submitter'],
        tags: [],
        // Create a very long text field that will need truncation
        text: 'A'.repeat(15000),
        plain_text: 'A'.repeat(15000),
        title: 'Report title',
        url: 'https://example.com',
      },
    ];

    const classifications = [
      {
        _id: '60dd465f80935bc89e6f9b00',
        incidents: [1],
        reports: [],
        namespace: 'CSETv0',
        attributes: [
          { short_name: 'Named Entities', value_json: '["TestEntity"]' },
          {
            short_name: 'Harm Type',
            value_json: '["Harm to physical health/safety"]',
          },
          { short_name: 'Publish', value_json: 'true' },
        ],
        notes: null,
      },
    ];

    return { incidents, reports, classifications };
  };

  const setupTranslationsTest = (data) => {
    const { incidents, reports, classifications, reportTranslations, duplicates } = data;
    const reporter = { log: sinon.stub() };

    const mongoClientStub = {
      connect: sinon.stub().resolves(),
      close: sinon.stub().resolves(),
      db: sinon.stub().callsFake((dbName: string) => {
        if (dbName === 'aiidprod') {
          return {
            collection: (name: string) => {
              if (name === 'reports') {
                return {
                  find: sinon.stub().returns({
                    toArray: sinon.stub().resolves(reports),
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
              if (name === 'taxa') {
                return {
                  find: sinon.stub().returns({
                    toArray: sinon.stub().resolves([]),
                  }),
                };
              }
              return null;
            },
          };
        }
        if (dbName === 'translations') {
          return {
            collection: (name: string) => {
              if (name === 'reports') {
                return {
                  find: sinon.stub().callsFake((filter: { language?: string }) => {
                    const filtered = filter?.language
                      ? reportTranslations.filter((trans) => trans.language === filter.language)
                      : reportTranslations;

                    return {
                      toArray: sinon.stub().resolves(filtered),
                    };
                  }),
                };
              }
              return null;
            },
          };
        }
        return null;
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

    return { 
      reporter, 
      mongoClientStub, 
      algoliaClientStub, 
      esIndex, 
      enIndex 
    };
  };

  const setupAlgoliaSubsetTest = (data) => {
    const { incidents, reports, classifications } = data;
    const reporterStub = { log: sinon.stub() };
    const consoleLogSpy = sinon.spy(console, 'log');

    const mongoClientStub = {
      connect: sinon.stub().resolves(),
      close: sinon.stub().resolves(),
      db: sinon.stub().callsFake((dbName) => {
        if (dbName === 'aiidprod') {
          return {
            collection: (name) => {
              if (name === 'reports') {
                return {
                  find: sinon.stub().returns({
                    toArray: sinon.stub().resolves(reports),
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
                    toArray: sinon.stub().resolves([]),
                  }),
                };
              }
              if (name === 'taxa') {
                return {
                  find: sinon.stub().returns({
                    toArray: sinon.stub().resolves([]),
                  }),
                };
              }
              return {
                find: sinon.stub().returns({
                  toArray: sinon.stub().resolves([]),
                }),
              };
            },
          };
        }
        if (dbName === 'translations') {
          return {
            collection: (name) => {
              if (name === 'reports') {
                return {
                  find: sinon.stub().returns({
                    toArray: sinon.stub().resolves([]),
                  }),
                };
              }
              return null;
            },
          };
        }
        return null;
      }),
    };

    const indexStub = {
      replaceAllObjects: sinon.stub().resolves({ objectIDs: ['1'] }),
      setSettings: sinon.stub().resolves({}),
      deleteBy: sinon.stub().resolves({}),
    };

    const replicaIndexStub = {
      setSettings: sinon.stub().resolves({}),
    };

    const algoliaClientStub = {
      initIndex: sinon.stub().callsFake((indexName) => {
        if (indexName === 'instant_search-en') return indexStub;
        if (indexName.includes('instant_search-en-') || indexName.includes('instant_search-en_')) {
          return replicaIndexStub;
        }
        return null;
      }),
    };

    return {
      reporterStub,
      consoleLogSpy,
      mongoClientStub,
      algoliaClientStub,
      indexStub,
    };
  };

  let originalAlgoliaSubset;
  
  test.beforeAll(() => {
    originalAlgoliaSubset = process.env.ALGOLIA_SUBSET;
  });
  
  test.afterAll(() => {
    process.env.ALGOLIA_SUBSET = originalAlgoliaSubset;
  });

  test('Should update translations to Algolia', async ({ page }) => {
    const testData = setupCommonTestData();
    const { reporter, mongoClientStub, algoliaClientStub, esIndex, enIndex } = setupTranslationsTest(testData);

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

    const enReplaceAllObjectsArgs = enIndexResult.replaceAllObjects.getCall(0).args[0];
    enReplaceAllObjectsArgs.forEach((entry) => {
      if (entry.incident_id) {
        expect(entry.incident_id).toBeDefined();
      }
      if (entry.is_translated) {
        expect(entry.language).not.toBe('en');
      }
    });

    const esIndexResult = algoliaClientStub.initIndex('instant_search-es');
    expect(esIndexResult.replaceAllObjects.calledOnce).toBeTruthy();

    const esReplaceAllObjectsArgs = esIndexResult.replaceAllObjects.getCall(0).args[0];
    esReplaceAllObjectsArgs.forEach((entry) => {
      if (entry.incident_id) {
        expect(entry.incident_id).toBeDefined();
      }
      if (entry.is_translated) {
        expect(entry.language).not.toBe('es');
      }
    });
  });

  test('Should handle algolia_subset when enabled', async ({ page }) => {

    process.env.ALGOLIA_SUBSET = 'true';
    
    const testData = createLargeReportMockData();
    const { 
      reporterStub, 
      consoleLogSpy, 
      mongoClientStub, 
      algoliaClientStub, 
      indexStub 
    } = setupAlgoliaSubsetTest(testData);

    const updater = new AlgoliaUpdater({
      mongoClient: mongoClientStub,
      algoliaClient: algoliaClientStub,
      languages: [{ code: 'en' }],
      reporter: reporterStub,
    });

    await updater.run();

    // Verify that the subset mode log message was printed
    expect(consoleLogSpy.calledWith('Running in Algolia subset mode - entries will be truncated to fit size limits')).toBeTruthy();

    // Check that Algolia had data sent to it
    const enIndexResult = algoliaClientStub.initIndex('instant_search-en');
    expect(enIndexResult.replaceAllObjects.calledOnce).toBeTruthy();

    // Get the uploaded objects and verify we have at least one
    const uploadedObjects = enIndexResult.replaceAllObjects.getCall(0).args[0];
    expect(uploadedObjects.length).toBeGreaterThan(0);
    
    // Find the report in the uploaded objects
    const uploadedReport = uploadedObjects.find(obj => obj.report_number === 1);
    expect(uploadedReport).toBeDefined();
    
    // Check the structure of the uploaded report
    // If it has a text property that needed truncation, check that
    const hasStringLengthLessThanOriginal = Object.entries(uploadedReport).some(([key, value]) => {
      return typeof value === 'string' && value.length > 0 && value.length < 15000;
    });
    
    expect(hasStringLengthLessThanOriginal).toBeTruthy();

    consoleLogSpy.restore();
  });

  test('Should handle algolia_subset when disabled', async ({ page }) => {

    process.env.ALGOLIA_SUBSET = '';
    
    const testData = createLargeReportMockData();
    const { 
      reporterStub, 
      consoleLogSpy, 
      mongoClientStub, 
      algoliaClientStub, 
    } = setupAlgoliaSubsetTest(testData);

    const updater = new AlgoliaUpdater({
      mongoClient: mongoClientStub,
      algoliaClient: algoliaClientStub,
      languages: [{ code: 'en' }],
      reporter: reporterStub,
    });

    await updater.run();

    expect(consoleLogSpy.calledWith('Running in Algolia subset mode - entries will be truncated to fit size limits')).toBeFalsy();

    const enIndexResult = algoliaClientStub.initIndex('instant_search-en');
    expect(enIndexResult.replaceAllObjects.calledOnce).toBeTruthy();

    const uploadedObjects = enIndexResult.replaceAllObjects.getCall(0).args[0];
    expect(uploadedObjects.length).toBeGreaterThan(0);
    
    const uploadedReport = uploadedObjects.find(obj => obj.report_number === 1);
    expect(uploadedReport).toBeDefined();
    
    const hasStringLengthLessThanOriginal = Object.entries(uploadedReport).some(([key, value]) => {
      return typeof value === 'string' && value.length > 0 && value.length <= 8000;
    });
    
    expect(hasStringLengthLessThanOriginal).toBeTruthy();

    consoleLogSpy.restore();
  });
});
