const path = require('path');

const createSubmitSuccessPage = async (_graphql, createPage) => {
  createPage({
    path: '/submit/success',
    component: path.resolve('./src/templates/submitSuccess.js'),
  });
};

module.exports = createSubmitSuccessPage;
