import { Log, LogModel, LogDocument } from './LogModel';

class LogQueries {
  create = async (logs: Log | Log[]): Promise<LogDocument> => {
    return await LogModel.create(logs);
  }
}

export const logQueries = new LogQueries();
