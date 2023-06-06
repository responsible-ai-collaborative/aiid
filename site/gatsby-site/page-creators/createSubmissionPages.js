const path = require('path');

const { switchLocalizedPath } = require('../i18n');

const createSubmissionPages = async (graphql, createPage, { languages }) => {
  const result = await graphql(
    `
      query SubmissionPages {
        submissions: allMongodbAiidprodSubmissions {
          nodes {
            id
            title
            description
            cloudinary_id
          }
        }
      }
    `
  );

  const {
    submissions: { nodes: submissions },
  } = result.data;

  const pageContexts = [];

  for (const submission of submissions) {
    pageContexts.push({
      id: submission.id,
      title: submission.title,
      description: submission.description,
      cloudinary_id: submission.cloudinary_id,
    });
  }

  console.log(submissions);

  for (const language of languages) {
    for (const context of pageContexts) {
      const pagePath = switchLocalizedPath({
        newLang: language.code,
        path: '/submission/' + context.id + '/',
      });

      createPage({
        path: pagePath,
        component: path.resolve('./src/templates/submission.js'),
        context: {
          ...context,
          originalPath: pagePath,
          locale: language.code,
          hrefLang: language.hrefLang,
        },
      });
    }
  }
};

module.exports = createSubmissionPages;
