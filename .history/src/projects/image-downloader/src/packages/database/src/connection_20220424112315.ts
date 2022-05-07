import mongoose from 'mongoose';

import mongoCore from '@zougui/common.mongo-core';

import { dbName, host, port, username, password } from './constants';

export const connect = (): Promise<typeof mongoose> => {
  console.log({
    dbName,
    host,
    port,
    username,
    password,
  })
  return mongoCore.connect({
    dbName,
    host,
    port,
    username,
    password,
  });
}
