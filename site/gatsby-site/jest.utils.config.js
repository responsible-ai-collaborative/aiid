/**
 * Minimal Jest config for running pure utility function tests.
 * Separate from the main jest.config.ts which requires MongoDB setup.
 */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { presets: ['@babel/preset-env'] }],
  },
  testMatch: ['**/src/utils/__tests__/**/*.test.js'],
};
