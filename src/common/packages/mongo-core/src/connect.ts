import mongoose from 'mongoose';

import env from '@zougui/common.env';

const defaultProtocol = 'mongodb';
const defaultHost = 'localhost';
const defaultPort = 27017;
const defaultEnvSuffix = true;

export const connect = async (options: ConnectOptions, mongoOptions: mongoose.ConnectOptions | undefined = {}): Promise<typeof mongoose> => {
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

  return await mongoose.connect(connectionUri, actualMongoOptions);
}

export interface ConnectOptions {
  host?: string | undefined;
  port?: number | undefined;
  dbName: string;
  username?: string | undefined;
  password?: string | undefined;
  /**
   * @default true
   */
  envSuffix?: boolean | undefined;
}
