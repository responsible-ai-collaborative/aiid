const path = require('path');

const { Client: GoogleMapsAPIClient } = require('@googlemaps/google-maps-services-js');

const { Translate } = require('@google-cloud/translate').v2;

const { startCase, differenceWith } = require('lodash');

const config = require('./config');

const createMdxPages = require('./page-creators/createMdxPages');

const createCitationPages = require('./page-creators/createCitationPages');

const createWordCountsPages = require('./page-creators/createWordCountsPage');

const createBackupsPage = require('./page-creators/createBackupsPage');

const createTaxonomyPages = require('./page-creators/createTaxonomyPages');

const createDownloadIndexPage = require('./page-creators/createDownloadIndexPage');

const createDuplicatePages = require('./page-creators/createDuplicatePages');

const createTsneVisualizationPage = require('./page-creators/createTsneVisualizationPage');

const createEntitiesPages = require('./page-creators/createEntitiesPages');

const algoliasearch = require('algoliasearch');

const Translator = require('./src/utils/Translator');

const { MongoClient } = require('mongodb');

const { getLanguages } = require('./i18n');

const AlgoliaUpdater = require('./src/utils/AlgoliaUpdater');

const googleMapsApiClient = new GoogleMapsAPIClient({});

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createRedirect, createPage } = actions;

  const redirects = [
    ['/about_apps/1-discover', '/about_apps'],
    ['/about_apps/2-submit', '/about_apps'],
    ['/about_apps/3-your_app_here', '/about_apps'],
    ['/apps/quickadd', '/apps/submit'],
    ['/discover', '/apps/discover'],
    ['/discover', '/apps/discover'],
    ['/summaries', '/about_apps'],
    ['/about/1-governance', '/about'],
    ['/about/blog', '/blog'],
    ['/research/4-taxonomies', '/taxonomies'],
    ['/research', '/research/snapshots'],
  ];

  redirects.forEach((pair) =>
    createRedirect({ fromPath: pair[0], toPath: pair[1], isPermanent: true })
  );

  for (const pageCreator of [
    createMdxPages,
    createCitationPages,
    createWordCountsPages,
    createBackupsPage,
    createTaxonomyPages,
    createDownloadIndexPage,
    createDuplicatePages,
    createTsneVisualizationPage,
    createEntitiesPages,
  ]) {
    if (!(process.env.SKIP_PAGE_CREATOR || '').split(',').includes(pageCreator.name)) {
      reporter.info(`Page creation: ${pageCreator.name}`);
      await pageCreator(graphql, createPage, reporter);
    }
  }
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        contexts: path.resolve(__dirname, 'src/contexts'),
        mongodb: path.resolve(__dirname, 'src/mongodb'),
        pages: path.resolve(__dirname, 'src/pages'),
        services: path.resolve(__dirname, 'src/services'),
        templates: path.resolve(__dirname, 'src/templates'),
        utils: path.resolve(__dirname, 'src/utils'),
        buble: '@philpl/buble', // to reduce bundle size
      },
      fallback: { crypto: false },
    },
  });
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-proposal-export-default-from',
  });
};

exports.onCreateNode = async ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const parent = getNode(node.parent);

    let value = parent.relativePath.replace(parent.ext, '');

    if (value === 'index') {
      value = '';
    }

    if (parent.sourceInstanceName === 'blog') {
      value = `blog/${value}`;
    }

    createNodeField({
      name: `slug`,
      node,
      value: `/${value}`,
    });

    createNodeField({
      name: 'id',
      node,
      value: node.id,
    });

    createNodeField({
      name: 'title',
      node,
      value: node.frontmatter.title || startCase(parent.name),
    });
  }

  if (node.internal.type == 'mongodbAiidprodClassifications') {
    let value = { geometry: { location: { lat: 0, lng: 0 } } };

    if (config.google.mapsApiKey) {
      try {
        if (node.classifications.Location && node.classifications.Location !== '') {
          const {
            data: {
              results: { 0: geometry },
            },
          } = await googleMapsApiClient.geocode({
            params: { key: config.google.mapsApiKey, address: node.classifications.Location },
          });

          value = geometry;
        }
      } catch (e) {
        console.log(e);
        console.log('Error fetching geocode data for', node.classifications.Location);
      }
    }

    createNodeField({
      name: 'geocode',
      node,
      value,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type reportEmbedding {
      vector: [Float]
      from_text_hash: String
    }

    type incidentEmbedding {
      vector: [Float]
      from_reports: [Int]
    }

    type mongodbAiidprodIncidents implements Node {
      embedding: incidentEmbedding
    }

    type nlpSimilarIncident {
      incident_id: Int
      similarity: Float
    }

    type mongodbAiidprodIncidents implements Node {
      nlp_similar_incidents: [nlpSimilarIncident]
      editor_similar_incidents: [Int]
      editor_dissimilar_incidents: [Int]
      flagged_dissimilar_incidents: [Int]
    }
    
    type mongodbAiidprodSubmissions implements Node {
      nlp_similar_incidents: [nlpSimilarIncident]
      editor_similar_incidents: [Int]
      editor_dissimilar_incidents: [Int]
    }

    type mongodbAiidprodReports implements Node {
      cloudinary_id: String
      tags: [String]
      plain_text: String
      embedding: reportEmbedding 
    }

    type mongodbAiidprodTaxaField_list implements Node {
      render_as: String
    }  
    
    type mongodbAiidprodTaxa implements Node {
      field_list: [mongodbAiidprodTaxaField_list]
    }

    type mongodbAiidprodTaxaField_list {
      default: String
      placeholder: String
    }

    type mongodbAiidprodResourcesClassifications implements Node {
      MSFT_AI_Fairness_Checklist: Boolean
    }
  `;

  createTypes(typeDefs);
};

exports.onPreBootstrap = async ({ reporter }) => {
  const migrationsActivity = reporter.activityTimer(`Migrations`);

  if (!process.env.MONGODB_MIGRATIONS_CONNECTION_STRING) {
    console.warn('MONGODB_MIGRATIONS_CONNECTION_STRING is not set, skipping migrations.');
  } else if (process.env.CONTEXT !== 'production') {
    console.info('Netlify CONTEXT is not production, skipping migrations.');
  } else {
    migrationsActivity.start();
    migrationsActivity.setStatus('Running...');

    const migrator = require('./migrator');

    await migrator.umzug.runAsCLI(['up']);

    migrationsActivity.setStatus('Finished!');

    migrationsActivity.end();
  }

  if (process.env.CONTEXT === 'production') {
    const translationsActivity = reporter.activityTimer(`Translations`);

    translationsActivity.start();

    const configuredLanguages = getLanguages();

    const unavailableLanguages = differenceWith(
      config.i18n.availableLanguages,
      configuredLanguages,
      (aLang, cLang) => {
        return cLang.code === aLang;
      }
    );

    if (unavailableLanguages.length > 0) {
      throw `Language config error. Review your GATSBY_AVAILABLE_LANGUAGES variable. You've included a language that hasn't been configured yet: ${unavailableLanguages
        .map((l) => l)
        .join(', ')}`;
    }

    if (
      config.mongodb.translationsConnectionString &&
      config.i18n.translateApikey &&
      config.i18n.availableLanguages &&
      config.header.search.algoliaAdminKey &&
      config.header.search.algoliaAppId
    ) {
      if (process.env.TRANSLATE_DRY_RUN !== 'false') {
        reporter.warn(
          'Please set `TRANSLATE_DRY_RUN=false` to disble dry running of translation process.'
        );
      }

      translationsActivity.setStatus('Translating incident reports...');

      const translateClient = new Translate({ key: config.i18n.translateApikey });

      const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

      const languages = getLanguages();

      const translator = new Translator({ mongoClient, translateClient, languages, reporter });

      await translator.run();

      translationsActivity.setStatus('Updating incidents indexes...');

      const algoliaClient = algoliasearch(
        config.header.search.algoliaAppId,
        config.header.search.algoliaAdminKey
      );

      const algoliaUpdater = new AlgoliaUpdater({
        languages,
        mongoClient,
        algoliaClient,
        reporter,
      });

      await algoliaUpdater.run();
    } else {
      throw `Missing environment variable, can't run translation process.`;
    }

    translationsActivity.end();
  } else {
    reporter.warn('Netlify CONTEXT is not production, skipping translations.');
  }
};

exports.onPreBuild = function ({ reporter }) {
  if (!config.google.mapsApiKey) {
    reporter.warn('Missing environment variable GOOGLE_MAPS_API_KEY.');
  }
};

exports.onPostBuild = async ({ reporter }) => {
  reporter.info('Site has been built!');

  reporter.info('Processing pending notifications...');

  const processNotifications = require('./postBuild/processNotifications');

  try {
    const result = await processNotifications();

    reporter.info(`${result?.data?.processNotifications?.length} notifications were processed!`);
  } catch (error) {
    reporter.error('Error processing pending notifications:', error);
  }
};
