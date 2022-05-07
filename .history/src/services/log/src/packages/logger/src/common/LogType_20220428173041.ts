import { AnyObject } from '@zougui/common.type-utils';

import { LogKind } from './LogKind';
import { LogContext } from './LogContext';

export interface LogType<T extends AnyObject> {
  logKinds: LogKind[];
  logId: string;
  code: string;
  namespace: string;
  tags: string[];
  message: (context: LogContext<T>) => string;
}
