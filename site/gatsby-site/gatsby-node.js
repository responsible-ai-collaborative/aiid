const path = require('path');

const startCase = require('lodash.startcase');

const config = require('./config');

const createMdxPages = require('./page-creators/createMdxPages');

const createCitiationPages = require('./page-creators/createCitiationPages');

const createWordCountsPages = require('./page-creators/createWordCountsPage');

const createBackupsPage = require('./page-creators/createBackupsPage');

const createTaxonomyPages = require('./page-creators/createTaxonomyPages');

const createBlogPosts = require('./page-creators/createBlogPosts');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const { createRedirect } = actions;

  const redirects = [
    ['/about_apps/1-discover', '/about_apps'],
    ['/about_apps/2-submit', '/about_apps'],
    ['/about_apps/3-your_app_here', '/about_apps'],
    ['/apps/quickadd', '/apps/submit'],
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

// https://github.com/gatsbyjs/gatsby/issues/17761#issuecomment-533816520
const express = require('express');

exports.onCreateDevServer = ({ app }) => {
  app.use(express.static('public'));
};
