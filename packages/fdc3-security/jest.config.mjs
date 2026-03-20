/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/test', '<rootDir>/samples'],
  moduleFileExtensions: ['js', 'ts'],
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['node_modules/(?!(jose|canonicalize)/)'],
  testRegex: '.+\\.test\\.ts?$',
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text', 'json', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    'PublicFDC3Security\\.ts$',
    'PrivateFDC3Security\\.ts$',
    'FDC3UserClaims\\.ts$',
    'Messaging\\.ts$',
  ],
  // Use V8 coverage provider for better TypeScript source map support
  coverageProvider: 'v8',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        // Enable source maps for accurate coverage mapping
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          sourceMap: true,
          inlineSourceMap: false,
          inlineSources: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
