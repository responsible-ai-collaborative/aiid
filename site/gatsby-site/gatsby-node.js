const path = require('path');

const startCase = require('lodash.startcase');
const stopword = require('stopword');
const stemmer = require('stemmer');

const config = require('./config');
const customStopWords = require('./constants/customStopWords');

exports.createPages = ({ graphql, actions }) => {

  const { createPage } = actions;

  const promiseMdx = new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMdx {
              edges {
                node {
                  fields {
                    id
                  }
                  tableOfContents
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors); // eslint-disable-line no-console
          reject(result.errors);
        }

        // Create blog posts pages.
        result.data.allMdx.edges.forEach(({ node }) => {
          createPage({
            path: node.fields.slug ? node.fields.slug : '/',
            component: path.resolve('./src/templates/docs.js'),
            context: {
              id: node.fields.id,
            },
          });
        });
      })
    );
  });

  const wordCounts = new Promise((resolve, reject) => {
    resolve(
      graphql(
        `query WordCounts {
          allMongodbAiidprodIncidents {
            nodes {
              text
            }
          }
        }`
      ).then(result => {
        if (result.errors) {
          console.log(result.errors); // eslint-disable-line no-console
          reject(result.errors);
        }


        // Create wordcounts page
        const wordCounts = {};

        result.data.allMongodbAiidprodIncidents.nodes.forEach(element => {
          if (element['text']) {
            const words = stopword.removeStopwords(element['text'].split(' '), customStopWords);

            for (let i = 0; i < words.length; i++) {
              let word = stemmer(words[i].toLowerCase().replace(/\W/g, ''));

              if (word in wordCounts) {
                wordCounts[word] += 1;
              } else {
                wordCounts[word] = 1;
              }
            }
          }
        });

        const wordCountsSorted = [];

        for (let word in wordCounts) {
          if (wordCounts[word] > 99 && word.length > 2) wordCountsSorted.push([word, wordCounts[word]]);
        }

        wordCountsSorted.sort(function (a, b) {
          return b[1] - a[1];
        });

        const numWordClouds = 8;
        const wordsPerCloud = 80;

        let wordClouds = [];

        for (let i = 0; i < numWordClouds; i++) {
          wordClouds.push([]);
          for (var j = i * wordsPerCloud; j < (i + 1) * wordsPerCloud; j++) {
            wordClouds[i].push({ text: wordCountsSorted[j][0], value: wordCountsSorted[j][1] });
          }
        }

        createPage({
          path: '/summaries/wordcounts',
          component: path.resolve('./src/pages/wordcounts.js'),
          context: {
            wordClouds,
            wordCountsSorted,
            wordsPerCloud,
          },
        });
      })
    )
  })

  const citations = new Promise((resolve, reject) => {
    resolve(
      graphql(
        `query IncidentIDs {
           allMongodbAiidprodIncidents {
             distinct(field: incident_id)
               nodes {
                 incident_id
               }
            }
         }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors); // eslint-disable-line no-console
          reject(result.errors);
        }

        // Create citation pages
        result.data.allMongodbAiidprodIncidents.distinct.forEach((incident_id) => {
          createPage({
            path: '/cite/' + incident_id,
            component: path.resolve('./src/templates/cite.js'),
            context: {
              incident_id: parseInt(incident_id),
            },
          });
        });
      })
    );
  });

  return Promise.all([promiseMdx, citations])
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        "@components": path.resolve(__dirname, 'src/components'),
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
  app.use(express.static('public'))
}
