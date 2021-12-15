const path = require('path');

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

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const { createRedirect } = actions;

  const redirects = [
    ['/about_apps/1-discover', '/about_apps'],
    ['/about_apps/2-submit', '/about_apps'],
    ['/about_apps/3-your_app_here', '/about_apps'],
    ['/apps/quickadd', '/apps/submit'],
    ['/discover', '/apps/discover'],
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

exports.onCreateNode = ({ node, getNode, actions }) => {
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
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type mongodbAiidprodIncidents implements Node {
      cloudinary_id: String
    }
  `;

  createTypes(typeDefs);
};

exports.onPostBuild = async function ({ graphql, reporter }) {
  const activity = reporter.activityTimer(`Algolia`);

  activity.start();

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

    activity.end();
  } else {
    activity.setStatus(`Missing env settings, skipping index upload.`);
    activity.end();
  }
};
