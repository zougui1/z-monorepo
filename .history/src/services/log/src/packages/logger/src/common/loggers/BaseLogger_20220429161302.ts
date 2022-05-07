import minimatch from 'minimatch';

import type { InternalBaseLoggerConfig, LogOptions } from './internal-types';
import { LogLevel, LogLevelNumber } from '../LogLevel';
import type { Log } from '../Log';

export abstract class BaseLogger {
  protected config: InternalBaseLoggerConfig;

  constructor(config?: BaseLoggerConfig) {
    this.config = processConfig(config);
  }

  //#region public logging methods
  debug = (log: Log): this => {
    return this;
  }
  //#endregion

  //#region protected logging methods
  protected log = async (log: Log, options: LogOptions): Promise<void> => {
    if (!this.canLog(log, options)) {
      return;
    }


  }

  protected abstract print = (log: Log, options: LogOptions): Promise<void>;
  //#endregion

  //#region helpers
  protected canLog = (log: Log, options: LogOptions): boolean => {
    const isLogLevelAllowed = LogLevelNumber[options.level] >= LogLevelNumber[this.config.minLogLevel];

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
