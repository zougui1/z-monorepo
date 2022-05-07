import axios from 'axios';

import { BaseBatchLogger, BaseBatchLoggerConfig } from './BaseBatchLogger';
import type { BatchLog } from './internal-types';
import { logToJson } from '../logToJson';

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
      console.log('http error', error)
      this.emit('batch-error', batch.map(b => ({ ...b, error })));
    }
  }
}

export interface HttpLoggerConfig extends BaseBatchLoggerConfig {
  url: string;
}
