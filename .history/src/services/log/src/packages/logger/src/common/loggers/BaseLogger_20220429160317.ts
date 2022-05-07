import type { InternalBaseLoggerConfig, LogOptions } from './internal-types';
import { LogLevel } from '../LogLevel';
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

  }
  //#endregion

  //#region helpers
  protected canLog = (level: LogLevel): boolean => {

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
