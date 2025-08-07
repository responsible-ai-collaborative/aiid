const path = require('path');

const { Client: GoogleMapsAPIClient } = require('@googlemaps/google-maps-services-js');

const { startCase } = require('lodash');

const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

const config = require('./config');

const createCitationPages = require('./page-creators/createCitationPages');

const createWordCountsPages = require('./page-creators/createWordCountsPage');

const createLandingPage = require('./page-creators/createLandingPage');

const createBackupsPage = require('./page-creators/createBackupsPage');

const createTaxonomyPages = require('./page-creators/createTaxonomyPages');

const createDownloadIndexPage = require('./page-creators/createDownloadIndexPage');

const createDuplicatePages = require('./page-creators/createDuplicatePages');

const createTsneVisualizationPage = require('./page-creators/createTsneVisualizationPage');

const createEntitiesPages = require('./page-creators/createEntitiesPages');

const createReportPages = require('./page-creators/createReportPages');

const createBlogPages = require('./page-creators/createBlogPages');

const createDocPages = require('./page-creators/createDocPages');

const createMissingTranslationsPage = require('./page-creators/createMissingTranslationsPage');

const { MongoClient } = require('mongodb');

const { getLanguages } = require('./i18n');

const typeDefs = require('./typeDefs');

const googleMapsApiClient = new GoogleMapsAPIClient({});

const LookupIndex = require('./src/utils/LookupIndex');

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
    ['/apps/newsSearch', '/apps/newsdigest'],
    ['/research/related-work', '/research/4-related-work'],
    ['/blog/incident-report-2022-january', '/blog/incident-report-2023-january'],
    ['/taxonomy/*', '/taxonomies/*'],
  ];

  redirects.forEach((pair) => {
    createRedirect({ fromPath: pair[0], toPath: pair[1], isPermanent: true });
  });

  for (const pageCreator of [
    createMissingTranslationsPage,
    createBlogPages,
    createCitationPages,
    createWordCountsPages,
    createLandingPage,
    createBackupsPage,
    createTaxonomyPages,
    createDownloadIndexPage,
    createDuplicatePages,
    createTsneVisualizationPage,
    createEntitiesPages,
    createReportPages,
    createDocPages,
  ]) {
    if (!(process.env.SKIP_PAGE_CREATOR || '').split(',').includes(pageCreator.name)) {
      reporter.info(`Page creation: ${pageCreator.name}`);
      await pageCreator(graphql, createPage, { reporter, languages: getLanguages() });
    }
  }
};

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  const config = {
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
        plugins: path.resolve(__dirname, 'plugins'),
      },
      fallback: { crypto: false },
    },
  };

  // Only add Sentry plugin for production builds
  if (stage === 'build-javascript' && process.env.SENTRY_DSN && process.env.SENTRY_AUTH_TOKEN) {
    config.devtool = 'source-map';
    config.plugins = [
      sentryWebpackPlugin({
        org: process.env.SENTRY_ORG || 'aiid',
        project: process.env.SENTRY_PROJECT || 'aiid',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
        sourcemaps: {
          assets: './public/**',
          deleteAfterUpload: true,
        },
        release: {
          name: process.env.SENTRY_RELEASE || process.env.GATSBY_COMMIT_SHA,
        },
      }),
    ];
  }

  actions.setWebpackConfig(config);
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-proposal-export-default-from',
  });

  actions.setBabelPlugin({
    name: 'graphql-codegen-babel',
    options: {
      artifactDirectory: './server/generated/',
      gqlTagName: 'gql',
    },
  });

  if (process.env.INSTRUMENT) {
    actions.setBabelPlugin({
      name: 'babel-plugin-istanbul',
      options: {
        include: ['src/**/*.js'],
      },
    });
  }
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

    createNodeField({
      name: 'previewText',
      node,
      value: node.frontmatter.previewText || startCase(parent.name),
    });
  }

  if (node.internal.type == 'mongodbAiidprodClassifications') {
    let value = { geometry: { location: { lat: 0, lng: 0 } } };

    if (config.google.mapsApiKey) {
      const locationAttribute = node.attributes.find((a) => a.short_name == 'Location');

      try {
        if (locationAttribute) {
          const locationValue = JSON.parse(locationAttribute.value_json);

          if (locationValue && locationValue !== '') {
            const {
              data: {
                results: { 0: geometry },
              },
            } = await googleMapsApiClient.geocode({
              params: { key: config.google.mapsApiKey, address: locationValue },
            });

            value = geometry;
          }
        }
      } catch (e) {
        console.log(e);
        console.log('Error fetching geocode data for', locationAttribute?.value_json);
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

  createTypes(typeDefs);
};

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    mongodbAiidprodIncidents: {
      Alleged_deployer_of_AI_system: {
        type: '[String]',
        resolve(source) {
          return source['Alleged deployer of AI system'];
        },
      },
      Alleged_developer_of_AI_system: {
        type: '[String]',
        resolve(source) {
          return source['Alleged developer of AI system'];
        },
      },
      Alleged_harmed_or_nearly_harmed_parties: {
        type: '[String]',
        resolve(source) {
          return source['Alleged harmed or nearly harmed parties'];
        },
      },
    },
  };

  createResolvers(resolvers);
};

exports.onPreInit = async ({ reporter }) => {
  reporter.log('Creating lookup index...');

  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const lookupIndex = new LookupIndex({
    client: mongoClient,
    filePath: path.join(__dirname, 'netlify', 'functions', 'lookupIndex.json'),
  });

  await lookupIndex.run();

  const staticIndex = new LookupIndex({
    client: mongoClient,
    filePath: path.join(__dirname, 'static', 'lookupIndex.json'),
    optimized: true,
  });

  await staticIndex.run();

  reporter.log('Lookup index created.');
};

exports.onPreBuild = function ({ reporter }) {
  if (!config.google.mapsApiKey) {
    reporter.warn('Missing environment variable GOOGLE_MAPS_API_KEY.');
  }
};
