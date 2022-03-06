import path from 'node:path';

import fs from 'fs-extra';

import { coverageConfig } from './coverageConfig';
import { getCoverageSources } from './getCoverageSources';
import { getCoverageDir } from './getCoverageDir';

const defaultSetupFilesAfterEnv = ['jest-extended', 'jest-date-mock'];
const rootDir = './src';
const absoluteRootDir = path.join(process.cwd(), rootDir);
const setupTestsFile = './setupTests.ts';
const absoluteSetupTestsFile = path.join(absoluteRootDir, setupTestsFile);

const dynamicSetupFilesAfterEnv = [];

if (fs.pathExistsSync(absoluteSetupTestsFile)) {
  dynamicSetupFilesAfterEnv.push(setupTestsFile);
}

export const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir,
  coverageDirectory: getCoverageDir(),
  collectCoverageFrom: getCoverageSources(),
  setupFilesAfterEnv: [...dynamicSetupFilesAfterEnv, ...defaultSetupFilesAfterEnv],
  coverageThreshold: coverageConfig,
  testTimeout: 10000,
}
