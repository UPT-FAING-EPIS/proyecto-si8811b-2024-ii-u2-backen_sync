import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    "/node_modules/",
    "/src/tests/integration_test/justification.integration.test.ts"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/config/**',      
    '!src/logs/**',        
    '!src/tests/**', 
    '!src/emails/**',    
    '!src/services/**',         
    '!src/middleware/**', 
    '!src/utils/**', 
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  moduleDirectories: ['node_modules', 'src'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 30000
};

export default config;