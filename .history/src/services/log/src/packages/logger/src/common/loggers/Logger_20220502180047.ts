import { LogKind } from '@zougui/log.log-types';

import { BaseLogger, BaseLoggerConfig } from './BaseLogger';
import { BaseBatchLoggerConfig } from './BaseBatchLogger';
import { ConsoleLogger } from './ConsoleLogger';
import { HttpLogger } from './HttpLogger';
import type { LogOptions } from './internal-types';
import { Log } from '../Log';

export class Logger extends BaseLogger {
  #console: ConsoleLogger;
  #http: HttpLogger;

  constructor(config?: LoggerConfig | undefined) {
    super();

    this.#console = new ConsoleLogger(config?.console);
    this.#http = new HttpLogger(config?.http);
  }

  //#region logging
  protected print = async (log: Log, options: LogOptions) => {
    const loggers = findAvailableLoggers(log, {
      [LogKind.console]: this.#console,
      [LogKind.http]: this.#http,
    } as any);

    await Promise.all(loggers.map(logger => logger.log(log, options)));
  }
  //#endregion
}

export interface LoggerConfig {
  console?: BaseLoggerConfig | undefined;
  http?: BaseBatchLoggerConfig | undefined;
}

export const findAvailableLoggers = (log: Log, loggers: Record<LogKind, BaseLogger>): BaseLogger[] => {
  return Object
    .entries(loggers)
    .filter(([name]) => log.logKinds.includes(name as LogKind))
    .map(([name, logger]) => logger);
}
