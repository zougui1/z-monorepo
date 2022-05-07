import axios from 'axios';

import { BaseBatchLogger } from './BaseBatchLogger';
import type { BatchLog } from './internal-types';

export class HttpLogger extends BaseBatchLogger {
  sendLogs = async (batch: BatchLog[]) => {
    try {
      await axios.post('url', {
        logs: batch.map(b => b.log),
      });

      this.emit('batch-logged', batch);
    } catch (error) {
      this.emit('batch-error', batch.map(b => ({ ...b, error })));
    }
  }
}
