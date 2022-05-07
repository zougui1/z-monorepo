import { EventEmitter } from 'node:events';

import minimatch from 'minimatch';

import type { InternalBaseLoggerConfig, LogOptions } from './internal-types';
import { LogLevel, LogLevelNumber } from '../enums';
import type { Log } from '../Log';

export abstract class BaseLogger extends EventEmitter {
  protected config: InternalBaseLoggerConfig;

  constructor(config?: BaseLoggerConfig) {
    super();

    this.config = processConfig(config);
  }

  //#region public logging methods
  debug = (log: Log): Promise<void> => {
    return this.log(log, { level: LogLevel.debug });
  }

  info = (log: Log): Promise<void> => {
    return this.log(log, { level: LogLevel.info });
  }

  success = (log: Log): Promise<void> => {
    return this.log(log, { level: LogLevel.success });
  }

  warn = (log: Log): Promise<void> => {
    return this.log(log, { level: LogLevel.warn });
  }

  error = (log: Log): Promise<void> => {
    return this.log(log, { level: LogLevel.error });
  }
  //#endregion

  //#region protected logging methods
  protected log = async (log: Log, options: LogOptions): Promise<void> => {
    if (!this.canLog(log, options)) {
      return;
    }

    await this.print(log, options);
  }

  protected abstract print(log: Log, options: LogOptions): Promise<void>;
  //#endregion

  //#region helpers
  protected canLog = (log: Log, options: LogOptions): boolean => {
    const isLogLevelAllowed = LogLevelNumber[this.config.minLogLevel] >= LogLevelNumber[options.level];

    if (!isLogLevelAllowed) {
      return false;
    }

    return minimatch(log.namespace, this.config.namespace);
  }
  //#endregion
}

const processConfig = (config?: BaseLoggerConfig | undefined): InternalBaseLoggerConfig => {
  return {
    minLogLevel: config?.minLogLevel || LogLevel.debug,
    namespace: config?.namespace || '*',
  };
}

export interface BaseLoggerConfig extends Partial<InternalBaseLoggerConfig> {

}