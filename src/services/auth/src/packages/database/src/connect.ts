import mongoCore from '@zougui/common.mongo-core';
import config from '@zougui/common.config/node';
export const connect = async (): Promise<void> => {
  mongoCore.connect({
    dbName: config.auth.database.name,
    host: config.auth.database.host,
  });
}
