/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  globals: {},
  transform: {
    '^.+\\.ts?$': ['ts-jest', { isolatedModules: true }],
  },
  testRegex: '.+\\.test\\.ts?$',
  testEnvironment: 'jsdom',
  reporters: ['default', 'jest-junit'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'json'],
};
