import axios from 'axios';

import { BaseBatchLogger } from './BaseBatchLogger';
import { logToJson } from './logToJson';
import type { BatchLog } from './internal-types';

export class HttpLogger extends BaseBatchLogger {
  sendLogs = async (batch: BatchLog[]) => {
    try {
      console.log(logToJson(batch[0].log, batch[0].options))
      await axios.post('http://localhost:3100/api/v1/logs', {
        logs: batch.map(b => logToJson(b.log, b.options)),
      });

      this.emit('batch-logged', batch);
    } catch (error) {
      this.emit('batch-error', batch.map(b => ({ ...b, error })));
    }
  }
}
