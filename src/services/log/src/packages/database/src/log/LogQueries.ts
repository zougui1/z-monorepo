import _ from 'lodash';

import { Log, LogDocument, logModels } from './LogModel';

class LogQueries {
  createMany = async (logs: Log[]): Promise<LogDocument[]> => {
    const devLogs = logs.filter(log => log.environment.app.env !== 'production');
    const productionLogs = logs.filter(log => log.environment.app.env === 'production');

    const allDocs = await Promise.all([
      logModels.Dev.create(devLogs),
      logModels.Production.create(productionLogs),
    ]);

    return allDocs.flat();
  }
}

export const logQueries = new LogQueries();
