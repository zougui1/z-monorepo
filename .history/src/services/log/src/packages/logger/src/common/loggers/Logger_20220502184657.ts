import { LogKind } from '@zougui/log.log-types';
import type { WeakEnum } from '@zougui/common.type-utils';

import { BaseLogger, BaseLoggerConfig } from './BaseLogger';
import { ConsoleLogger } from './ConsoleLogger';
import { HttpLogger, HttpLoggerConfig } from './HttpLogger';
import type { LogOptions } from './internal-types';
import { Log } from '../Log';

export class Logger extends BaseLogger {
  #console: ConsoleLogger | undefined;
  #http: HttpLogger | undefined;

  constructor(config?: LoggerConfig | undefined) {
    super();

    const loggers = config?.loggers || [LogKind.console];

    if (loggers.includes(LogKind.console)) {
      this.#console = new ConsoleLogger(config?.console);
    }

    if (loggers.includes(LogKind.http) && config?.http) {
      this.#http = new HttpLogger(config.http);
    }
  }

  //#region logging
  protected print = async (log: Log, options: LogOptions) => {
    const loggers = findAvailableLoggers(log, {
      [LogKind.console]: this.#console,
      [LogKind.http]: this.#http,
    });

    await Promise.all(loggers.map(logger => logger.log(log, options)));
  }
  //#endregion
}

export interface LoggerConfig {
  loggers?: WeakEnum<LogKind>[] | undefined;
  console?: BaseLoggerConfig | undefined;
  http?: HttpLoggerConfig | undefined;
}

export const findAvailableLoggers = (log: Log, loggers: Partial<Record<LogKind, BaseLogger | undefined>>): BaseLogger[] => {
  return Object
    .entries(loggers)
    .filter(([name, logger]) => logger && log.logKinds.includes(name as LogKind))
    .map(([name, logger]) => logger) as BaseLogger[];
}
