const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

module.exports = {
  // ... other config above ...

  devtool: 'source-map', // Source map generation must be turned on
  plugins: [
    sentryWebpackPlugin({
      org: 'aiid',
      project: 'aiid',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
};
