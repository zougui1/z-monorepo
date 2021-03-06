import { DateTime } from 'luxon';

import { indent } from '@zougui/common.string-utils';
import { LogColor } from '@zougui/log.log-types';

import { BaseLogger } from './BaseLogger';
import { TaskColorPicker } from './TaskColorPicker';
import type { LogOptions } from './internal-types';
import { crossPlatformConsoleStyles } from '../crossPlatformConsoleStyles';
import type { Log } from '../Log';

const defaultIdColor = '#00ffdb';

export class ConsoleLogger extends BaseLogger {
  protected taskColorPicker: TaskColorPicker = new TaskColorPicker();

  //#region logging
  line = (count: number = 1): this => {
    console.debug('\n'.repeat(count - 1));
    return this;
  }

  protected print = async (log: Log, options: LogOptions) => {
    const idColor = log.taskId
      ? this.taskColorPicker.getColor(log.taskId)
      : defaultIdColor;

    const { message, styles } = formatLog(log, options, idColor);

    console.log(message, ...styles);
    this.emit('logged', log);
  }
  //#endregion
}

const formatLog = (log: Log, options: LogOptions, idColor: string) => {
  const { level } = options;
  const timing = log.timings?.formatted || '';
  const formattedDate = log.createdAt.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
  const message = log.getMessage({
    cause: undefined,
    ...log,
    level,
  });

  const isMultiline = message.includes('\n');

  const { message: styledMessage, styles } = crossPlatformConsoleStyles([
    {
      message: '[',
      styles: { color: '#888' },
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
    {
      message: ` ${log.taskId || log.logId}`,
      styles: { color: idColor },
    },
    { message: timing ? ' ' : '' },
    {
      message: timing,
      styles: { color: '#ffdd00' },
    },
    {
      message: '] ',
      styles: { color: '#888' },
    },
    {
      message: log.namespace,
      styles: { color: '#ff39b2' },
    },
  ]);

  const actualMessage = isMultiline
    ? `${styledMessage} (\n${indent(message)}\n)`
    : `${styledMessage} ${message}`;

  return {
    message: actualMessage,
    styles,
  };
}
