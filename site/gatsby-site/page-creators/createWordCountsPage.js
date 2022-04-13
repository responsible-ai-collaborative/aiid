const path = require('path');

const stopword = require('stopword');

const stemmer = require('stemmer');

const customStopWords = require('../constants/customStopWords');

const PAGES_WITH_WORDCOUNT = [
  {
    path: '/summaries/wordcounts',
    componentPath: './src/pages/wordcounts.js',
  },
  {
    path: '/',
    componentPath: './src/templates/landingPage.js',
  },
];

const createWordCountsPage = (graphql, createPage) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          query WordCounts {
            allMongodbAiidprodReports {
              nodes {
                text
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          console.log(result.errors); // eslint-disable-line no-console
          reject(result.errors);
        }

        // Create wordcounts page
        const wordCounts = {};

        result.data.allMongodbAiidprodReports.nodes.forEach((element) => {
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
          if (wordCounts[word] > 99 && word.length > 2)
            wordCountsSorted.push([word, wordCounts[word]]);
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

        PAGES_WITH_WORDCOUNT.forEach((page) => {
          createPage({
            path: page.path,
            component: path.resolve(page.componentPath),
            context: {
              wordClouds,
              wordCountsSorted,
              wordsPerCloud,
            },
          });
        });
      })
    );
  });
};

module.exports = createWordCountsPage;
