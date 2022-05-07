import { EventEmitter } from 'node:events';

import minimatch from 'minimatch';

import { LogLevel, LogLevelNumber } from '@zougui/log.log-types';
import type { Cause } from '@zougui/common.error-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

import type { InternalBaseLoggerConfig, LogOptions } from './internal-types';
import type { Log } from '../Log';

export abstract class BaseLogger extends EventEmitter {
  protected config: InternalBaseLoggerConfig;

  constructor(config?: BaseLoggerConfig) {
    super();

    this.config = processConfig(config);
  }

  //#region public logging methods
  debug = (log: Log<any, any>): Promise<void> => {
    return this.log(log, { level: LogLevel.debug });
  }

  info = (log: Log<any, any>): Promise<void> => {
    return this.log(log, { level: LogLevel.info });
  }

  success = (log: Log<any, any>): Promise<void> => {
    return this.log(log, { level: LogLevel.success });
  }

  warn = (log: Log<any, any>): Promise<void> => {
    return this.log(log, { level: LogLevel.warn });
  }

  error = (log: Log<any, any>): Promise<void> => {
    return this.log(log, { level: LogLevel.error });
  }
  //#endregion

  //#region protected logging methods
  log = async (log: Log, options: LogOptions): Promise<void> => {
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
  // log everything by default
  return {
    minLogLevel: config?.minLogLevel || LogLevel.debug,
    namespace: config?.namespace || '*',
  };
}

export interface BaseLoggerConfig extends Partial<InternalBaseLoggerConfig> {

}
