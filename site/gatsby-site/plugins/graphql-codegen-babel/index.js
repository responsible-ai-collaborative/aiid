// Gatsby doesn't support importing babel plugins without default export so we need to export it as default

const { babelOptimizerPlugin } = require('@graphql-codegen/client-preset');

module.exports = babelOptimizerPlugin;
