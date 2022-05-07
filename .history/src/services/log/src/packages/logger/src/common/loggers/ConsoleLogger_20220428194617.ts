import { DateTime } from 'luxon';

import { Log } from '../Log';
import { LogLevel } from '../LogLevel';

export class ConsoleLogger {
  //#region logging
  line = (count: number = 1): this => {
    console.debug('\n'.repeat(count - 1));
    return this;
  }

  print = async (log: Log) => {
    const { message } = formatLog(log);

    console.log(message);
  }
  //#endregion
}

const formatLog = (log: Log) => {
  const formattedDate = log.createdAt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

  return {
    log,
    message: log.getMessage({
      ...log,
      level: LogLevel.debug,
    }),
    date: formattedDate,
  };
}
