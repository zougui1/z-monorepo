import path from 'node:path';

import isBrowser from 'is-browser';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import { WORKSPACE } from './nodeBaseEnv';
import { ROOT } from './constants';
import { publicPrefix, reactAppPrefix } from '../prefixes';

let configured: DotenvResult | undefined;
const fileName = '.env';

const getEnvFileName = (): string => {
  const { NODE_ENV } = process.env;
  const suffix = NODE_ENV || 'development';

  return `${fileName}.${suffix}`;
}

export const configEnv = (configDir: string = ROOT, options?: EnvConfigOptions): DotenvResult => {
  if (isBrowser) {
    return { parsed: {} };
  }

  if (configured) {
    return configured;
  }

  const configDirs = [
    configDir,
    WORKSPACE,
  ];

  // get a copy of the env
  const env = { ...process.env };
  const envFiles = configDirs.flatMap(getDirEnvsPaths);

  // dotenv do not override existing env variables
  // which means the first to be set is the one to be used

  const envVars = configured ??= configurePaths(envFiles);

  if (options?.preventProcessEnvOverride) {
    // restore `process.env` like it was before the configuration
    // of the env files
    process.env = env;
  } else {
    process.env = envVars.parsed;
  }

  return envVars;
}

const getDirEnvsPaths = (dir: string): string[] => {
  const envFileName = getEnvFileName();
  const commonEnvPath = path.resolve(WORKSPACE, dir, fileName);
  const envPath = path.resolve(WORKSPACE, dir, envFileName);

  return [envPath, commonEnvPath];
}

const configPath = (path: string) => {
  return dotenvExpand.expand(dotenv.config({ path }));
}

const configurePaths = (paths: string[]): DotenvResult => {
  const envs = paths.map(path => configPath(path));
  const erroredEnv = envs.find(env => env.error && (env.error as any).code !== 'ENOENT');

  if (erroredEnv) {
    return {
      error: erroredEnv.error,
      parsed: {},
    };
  }


  const parsedEnvs = envs.filter(env => env.parsed).map(env => env.parsed);
  const finalEnv = parsedEnvs.reduce((finalEnv, currentEnv) => {
    return {
      ...finalEnv,
      ...currentEnv,
    };
  }, {} as Record<string, string>);

  return {
    parsed: {
      ...finalEnv,
      ...getPublicEnvVars(finalEnv || {}),
    },
  };
}

const getPublicEnvVars = (envVars: Record<string, string>): Record<string, string> => {
  return Object.entries(envVars).reduce((acc, [key, value]) => {
    if (key.startsWith(publicPrefix)) {
      acc[key.replace(publicPrefix, reactAppPrefix)] = value;
    }

    return acc;
  }, {} as Record<string, string>);
}

export type DotenvResult = {
  error?: Error;
  parsed: { [name: string]: string };
}

export interface EnvConfigOptions {
  preventProcessEnvOverride?: boolean;
}
