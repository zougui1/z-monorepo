import { LogModel, LogDocument } from './LogModel';

class LogQueries {
  create = async (log: any): Promise<LogDocument> => {
    return await LogModel.create(log);
  }
}

export const logQueries = new LogQueries();
