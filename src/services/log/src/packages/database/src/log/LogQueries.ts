import { Log, LogModel, LogDocument } from './LogModel';

class LogQueries {
  create = async (log: Log): Promise<LogDocument> => {
    return await LogModel.create(log);
  }

  createMany = async (logs: Log[]): Promise<LogDocument[]> => {
    return await LogModel.create(logs);
  }
}

export const logQueries = new LogQueries();
