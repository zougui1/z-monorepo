import { DateTime } from 'luxon';

import { LogColor } from './LogColor';
import { crossPlatformConsoleStyles } from './crossPlatformConsoleStyles';
import { Log } from '../Log';
import { LogLevel } from '../LogLevel';

export class ConsoleLogger {
  //#region logging
  line = (count: number = 1): this => {
    console.debug('\n'.repeat(count - 1));
    return this;
  }

  print = async (log: Log) => {
    const { message, styles } = formatLog(log);

    console.log(message, ...styles);
  }
  //#endregion
}

const formatLog = (log: Log) => {
  const level = LogLevel.debug;
  const formattedDate = log.createdAt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
  const message = log.getMessage({
    ...log,
    level,
  });

  const { message: actualMessage, styles } = crossPlatformConsoleStyles([
    { message: '[' },
    {
      message: formattedDate,
      styles: { color: '#fff' },
    },
    { message: ' ' },
    {
      message: level.toUpperCase(),
      styles: { color: LogColor[level] },
    },
    /*{ message: timing ? ' ' : '' },
    {
      message: timing,
      styles: { color: '#ffdd00' },
    },*/
    { message: '] ' },
    {
      message: log.namespace || '',
      styles: { color: '#ff39b2' },
    },
    { message: ' ' },
    { message: message },
  ]);

  return {
    message: actualMessage,
    styles,
  };
}
