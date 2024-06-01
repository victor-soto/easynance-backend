import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  // transform: {
  //   '^.+\\.(t|j)s$': 'ts-jest'
  // },
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2021'
        },
        sourceMaps: 'inline'
      }
    ]
  },
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  coverageReporters: ['json-summary', 'lcov'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/../' }),
  coveragePathIgnorePatterns: [
    'controller.ts',
    'module.ts',
    'main.ts',
    'swagger.ts',
    'repository.ts',
    '<rootDir>/infra/',
    '<rootDir>/common/',
    '<rootDir>/utils/'
  ]
}
