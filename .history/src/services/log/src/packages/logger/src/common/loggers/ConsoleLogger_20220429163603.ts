import { DateTime } from 'luxon';

import { BaseLogger } from './BaseLogger';
import { LogColor } from './LogColor';
import { crossPlatformConsoleStyles } from './crossPlatformConsoleStyles';
import type { LogOptions } from './internal-types';
import { Log } from '../Log';

export class ConsoleLogger extends BaseLogger {
  //#region logging
  line = (count: number = 1): this => {
    console.debug('\n'.repeat(count - 1));
    return this;
  }

  protected print = async (log: Log, options: LogOptions) => {
    const { message, styles } = formatLog(log, options);

    console.log(message, ...styles);
  }
  //#endregion
}

const formatLog = (log: Log, options: LogOptions) => {
  const { level } = options;
  const timing = log.timings?.formatted || '';
  const formattedDate = log.createdAt.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
  const message = log.getMessage({
    ...log,
    level,
  });

  const { message: actualMessage, styles } = crossPlatformConsoleStyles([
    {
      message: '[',
      styles: { color: '#777' },
    },
    {
      message: formattedDate,
      styles: { color: '#fff' },
    },
    { message: ' ' },
    {
      message: level.toUpperCase(),
      styles: { color: LogColor[level] },
    },
    { message: timing ? ' ' : '' },
    {
      message: timing,
      styles: { color: '#ffdd00' },
    },
    { message: '] ' },
    {
      message: log.namespace,
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
