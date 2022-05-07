import axios from 'axios';

import { BaseBatchLogger, BaseBatchLoggerConfig } from './BaseBatchLogger';
import { logToJson } from './logToJson';
import type { BatchLog } from './internal-types';

export class HttpLogger extends BaseBatchLogger {
  #httpConfig: HttpLoggerConfig;

  constructor(config: HttpLoggerConfig) {
    super(config);

    this.#httpConfig = config;
  }

  sendLogs = async (batch: BatchLog[]) => {
    try {
      await axios.post(this.#httpConfig.url, {
        logs: batch.map(b => logToJson(b.log, b.options)),
      });

      this.emit('batch-logged', batch);
    } catch (error) {
      this.emit('batch-error', batch.map(b => ({ ...b, error })));
    }
  }
}

export interface HttpLoggerConfig extends BaseBatchLoggerConfig {
  url: string;
}
