const path = require('path');

const { Client: GoogleMapsAPIClient } = require('@googlemaps/google-maps-services-js');

const { Translate } = require('@google-cloud/translate').v2;

const { startCase } = require('lodash');

const config = require('./config');

const createMdxPages = require('./page-creators/createMdxPages');

const createCitationPages = require('./page-creators/createCitationPages');

const createWordCountsPages = require('./page-creators/createWordCountsPage');

const createBackupsPage = require('./page-creators/createBackupsPage');

const createTaxonomyPages = require('./page-creators/createTaxonomyPages');

const createDownloadIndexPage = require('./page-creators/createDownloadIndexPage');

const createDuplicatePages = require('./page-creators/createDuplicatePages');

const algoliasearch = require('algoliasearch');

const Translator = require('./src/utils/Translator');

const { MongoClient } = require('mongodb');

const { getLanguages } = require('./i18n');

const AlgoliaUpdater = require('./src/utils/AlgoliaUpdater');

const googleMapsApiClient = new GoogleMapsAPIClient({});

exports.createPages = ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const { createRedirect } = actions;

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
  ];

  redirects.forEach((pair) =>
    createRedirect({ fromPath: pair[0], toPath: pair[1], isPermanent: true })
  );

  return Promise.all([
    createMdxPages(graphql, createPage, reporter),
    createCitationPages(graphql, createPage),
    createWordCountsPages(graphql, createPage),
    createBackupsPage(graphql, createPage),
    createTaxonomyPages(graphql, createPage),
    createDownloadIndexPage(graphql, createPage),
    createDuplicatePages(graphql, createPage),
  ]);
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

    if (
      config.mongodb.translationsConnectionString &&
      config.i18n.translateApikey &&
      config.i18n.availableLanguages &&
      config.header.search.algoliaAdminKey &&
      config.header.search.algoliaAppId
    ) {
      try {
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
      } catch (e) {
        reporter.warn('Error running translation scripts:', e);
      }
    } else {
      throw `Missing environment variable, can't run translation process.`;
    }

    translationsActivity.end();
  } else {
    reporter.warn('Netlify CONTEXT is not production, skipping translations.');
  }
};

exports.onPreBuild = function () {
  if (!config.google.mapsApiKey) {
    console.warn('Missing environment variable GOOGLE_MAPS_API_KEY.');
  }
};
