import { DurationString, toMs } from '@zougui/common.ms';
import env from '@zougui/common.env';
import { onForcedExit } from '@zougui/common.process-utils';

import { BaseLogger, BaseLoggerConfig } from './BaseLogger';
import type { LogOptions, BatchLog, InternalBaseBatchLoggerConfig } from './internal-types';
import type { Log } from '../Log';

export abstract class BaseBatchLogger extends BaseLogger {
  protected readonly logs: Record<string, BatchLog> = {};
  protected batchConfig: InternalBaseBatchLoggerConfig;

  constructor(config?: BaseBatchLoggerConfig | undefined) {
    super(config);

    this.batchConfig = processConfig(config);
    this._init();
  }

  //#region logging methods

  protected print = (log: Log, options: LogOptions): Promise<void> => {
    return new Promise(resolve => {
      this.logs[log.logId] = {
        log,
        options,
        // TODO do something when a log fails to be logged
        callback: () => resolve(),
      };
    });
  }

  protected abstract sendLogs(batch: BatchLog[]): Promise<void>;
  //#endregion

  //#region helpers
  private _init(): void {
    this.on('batch-logged', batch => {
      for (const { callback } of batch) {
        callback();
      }
    });

    this.on('batch-error', batch => {
      for (const { callback, error } of batch) {
        console.log('error', error)
        callback(error);
      }
    });

    setInterval(() => {
      this.flush();
    }, this.batchConfig.interval);

    if (env.isBrowser) {
      window.onbeforeunload = this.flush;
    }

    if (env.isNode) {
      onForcedExit(this.flush);
    }
  }

  private flush = async (): Promise<void> => {
    const batch = Object.values(this.logs);

    if (!batch.length) {
      return;
    }

    for (const { log } of batch) {
      delete this.logs[log.logId];
    }

    await this.sendLogs(batch);
  }
  //#endregion
}

export interface BaseBatchLogger {
  on(event: 'batch-logged', listener: (logs: BatchLog[]) => void): this;
  on(event: 'batch-error', listener: (logs: (BatchLog & { error: unknown })[]) => void): this;

  emit(event: 'batch-logged', logs: BatchLog[]): boolean;
  emit(event: 'batch-error', logs: (BatchLog & { error: unknown })[]): boolean;
}

const processConfig = (config: BaseBatchLoggerConfig = {}): InternalBaseBatchLoggerConfig => {
  return {
    interval: toMs(config?.batch?.interval || '1 min'),
  };
}

export interface BaseBatchLoggerConfig extends BaseLoggerConfig {
  batch?: {
    interval?: number | DurationString | undefined;
  } | undefined;
}
