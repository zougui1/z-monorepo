import axios from 'axios';

import { BaseBatchLogger, BaseBatchLoggerConfig } from './BaseBatchLogger';
import type { BatchLog } from './internal-types';
import { logToJson } from '../logToJson';

const logUrl = 'http://localhost:3100/api/v1/logs';

export class HttpLogger extends BaseBatchLogger {
  sendLogs = async (batch: BatchLog[]) => {
    try {
      await axios.post(logUrl, {
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

}
