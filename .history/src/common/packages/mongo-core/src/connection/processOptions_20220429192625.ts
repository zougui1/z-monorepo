import type mongoose from 'mongoose';

import env from '@zougui/common.env';

import type { ConnectOptions } from './types';
import { defaultEnvSuffix, defaultHost, defaultPort, defaultProtocol } from '../constants';

export const processOptions = (options: ConnectOptions, mongoOptions: mongoose.ConnectOptions | undefined = {}): ProcessedOptions => {
  const {
    host = defaultHost,
    port = defaultPort,
    dbName,
    username,
    password,
    envSuffix = defaultEnvSuffix,
  } = options;

  const actualDbName = envSuffix
    ? `${dbName}_${env.NODE_ENV}`
    : dbName;

  const connectionUri = `${defaultProtocol}://${host}:${port}/${actualDbName}`;

  const actualMongoOptions = options.username && options.password
    ? { ...mongoOptions, user: username, pass: password }
    : mongoOptions;

  return {
    dbName,
    connectionUri,
    mongoOptions: actualMongoOptions,
  };
}

export interface ProcessedOptions {
  dbName: string;
  connectionUri: string;
  mongoOptions?: mongoose.ConnectOptions | undefined;
}
