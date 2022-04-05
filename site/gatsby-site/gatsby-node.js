const path = require('path');

const { Client: GoogleMapsAPIClient } = require('@googlemaps/google-maps-services-js');

const startCase = require('lodash.startcase');

const config = require('./config');

const createMdxPages = require('./page-creators/createMdxPages');

const createCitiationPages = require('./page-creators/createCitiationPages');

const createWordCountsPages = require('./page-creators/createWordCountsPage');

const createBackupsPage = require('./page-creators/createBackupsPage');

const createTaxonomyPages = require('./page-creators/createTaxonomyPages');

const createBlogPosts = require('./page-creators/createBlogPosts');

const createDownloadIndexPage = require('./page-creators/createDownloadIndexPage');

const discoverIndex = require('./src/utils/discoverIndexGenerator');

const algoliasearch = require('algoliasearch');

const algoliaSettings = require('./src/utils/algoliaSettings');

const translateIncidents = require('./src/utils/translateIncidents');

const updateDiscoverIndexes = require('./src/utils/updateDiscoverIndexes');

const googleMapsApiClient = new GoogleMapsAPIClient({});

exports.createPages = ({ graphql, actions }) => {
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
    createMdxPages(graphql, createPage),
    createCitiationPages(graphql, createPage),
    createWordCountsPages(graphql, createPage),
    createBackupsPage(graphql, createPage),
    createTaxonomyPages(graphql, createPage),
    createBlogPosts(graphql, createPage),
    createDownloadIndexPage(graphql, createPage),
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

    if (config.gatsby && config.gatsby.trailingSlash) {
      createNodeField({
        name: `slug`,
        node,
        value: value === '' ? `/` : `/${value}/`,
      });
    } else {
      createNodeField({
        name: `slug`,
        node,
        value: `/${value}`,
      });
    }

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
    type mongodbAiidprodReports implements Node {
      cloudinary_id: String
      tags: [String]
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
};

exports.onPreBuild = function () {
  if (!config.google.mapsApiKey) {
    console.warn('Missing environment variable GOOGLE_MAPS_API_KEY.');
  }
};

exports.onPostBuild = async function ({ graphql, reporter }) {
  const activity = reporter.activityTimer(`Algolia`);

  activity.start();

  if (
    config.mongodb.translationsConnectionString &&
    config.google.translateApikey &&
    config.google.availableLanguages &&
    config.header.search.algoliaAdminKey &&
    config.header.search.algoliaAppId
  ) {
    try {
      if (process.env.TRANSLATE_DRY_RUN !== 'false') {
        reporter.warn(
          'Please set `TRANSLATE_DRY_RUN=false` to disble dry running of translation process.'
        );
      }

      activity.setStatus('Translating incident reports...');

      await translateIncidents.run({ reporter });

      activity.setStatus('Updating incidents indexes...');

      await updateDiscoverIndexes.run({ reporter });
    } catch (e) {
      reporter.warn('Error running translation scripts:', e);
    }
  } else {
    reporter.log(`Missing env settings, skipping indexes translation and upload.`);
  }

  if (config.header.search.algoliaAppId && config.header.search.algoliaAdminKey) {
    activity.setStatus('Building index...');

    const data = await discoverIndex({ graphql });

    activity.setStatus('Uploading index...');

    const client = algoliasearch(
      config.header.search.algoliaAppId,
      config.header.search.algoliaAdminKey
    );

    const index = client.initIndex('instant_search');

    await index.saveObjects(data);

    activity.setStatus(`Uploaded ${data.length} items to the index.`);

    activity.setStatus('Updating settings...');

    await index.setSettings(algoliaSettings);

    activity.setStatus('Settings saved.');
  } else {
    activity.setStatus(`Missing env settings, skipping index upload.`);
  }

  activity.end();
};
