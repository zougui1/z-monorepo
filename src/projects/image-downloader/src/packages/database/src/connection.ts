import mongoCore from '@zougui/common.mongo-core';

import { dbName, host, port, username, password } from './constants';

export const connect = async (): Promise<void> => {
  await mongoCore.connect({
    dbName,
    host,
    port,
    username,
    password,
  });
}
