/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: ['js', 'ts'],
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['node_modules/(?!jose)'],
  testRegex: '.+\\.test\\.ts?$',
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'json'],
};
