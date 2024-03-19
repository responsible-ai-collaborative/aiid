const path = require('path');

const stopword = require('stopword');

const stemmer = require('stemmer');

const customStopWords = require('../constants/customStopWords');

const PAGES_WITH_WORDCOUNT = [
  {
    path: '/summaries/wordcounts',
    componentPath: './src/templates/wordcounts.js',
  },
  {
    path: '/',
    componentPath: './src/templates/landingPage.js',
  },
];

const createWordCountsPage = async (graphql, createPage) => {
  const result = await graphql(`
    query WordCounts {
      allMongodbAiidprodReports {
        nodes {
          text
        }
      }
      latestReport: allMongodbAiidprodReports(
        filter: { is_incident_report: { eq: true } }
        sort: { epoch_date_submitted: DESC }
        limit: 1
      ) {
        nodes {
          report_number
        }
      }
      latestReports: allMongodbAiidprodIncidents(
        filter: { reports: { elemMatch: { is_incident_report: { eq: true } } } }
        sort: { reports: { epoch_date_submitted: DESC } }
        limit: 5
      ) {
        nodes {
          title
          incident_id
          reports {
            cloudinary_id
            epoch_date_submitted
            image_url
            report_number
            source_domain
            text
            title
            url
          }
        }
      }
      sponsors: allPrismicSponsor(sort: { data: { order: { text: ASC } } }) {
        edges {
          node {
            data {
              title {
                text
                richText
              }
              order {
                text
              }
              language {
                text
              }
              items {
                name {
                  text
                }
                description {
                  richText
                }
                logo {
                  gatsbyImageData
                  url
                }
                link {
                  url
                }
              }
            }
          }
        }
      }
    }
  `);

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
    if (wordCounts[word] > 99 && word.length > 2) wordCountsSorted.push([word, wordCounts[word]]);
  }

  wordCountsSorted.sort(function (a, b) {
    return b[1] - a[1];
  });

  const numWordClouds = 8;

  const wordsPerCloud = 80;

  let wordClouds = [];

  if (wordCountsSorted.length > 0) {
    for (let i = 0; i < numWordClouds; i++) {
      wordClouds.push([]);
      for (var j = i * wordsPerCloud; j < (i + 1) * wordsPerCloud; j++) {
        wordClouds[i].push({ text: wordCountsSorted[j][0], value: wordCountsSorted[j][1] });
      }
    }
  }

  const fiveLatestIncidents = result.data.latestReports.nodes;

  PAGES_WITH_WORDCOUNT.forEach((page) => {
    createPage({
      path: page.path,
      component: path.resolve(page.componentPath),
      context: {
        wordClouds,
        wordCountsSorted,
        wordsPerCloud,
        fiveLatestIncidents,
        sponsors: result.data.sponsors.edges,
      },
    });
  });
};

module.exports = createWordCountsPage;
