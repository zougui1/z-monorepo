import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';

import type { AnyObject, SimpleVersion } from '@zougui/common.type-utils';
import type { Cause } from '@zougui/common.error-utils';

import { LogKind } from './LogKind';
import type { LogType } from './LogType';
import type { EnvironmentContext } from './EnvironmentContext';
import type { LogContext } from './LogContext';

export class Log<T extends AnyObject> implements LogType<T> {
  logKinds: LogKind[];
  logId: string = nanoid();
  code: string;
  namespace: string;
  tags: string[];
  message: (context: LogContext<T>) => string;
  data: T;
  environment: EnvironmentContext;
  version: SimpleVersion;
  createdAt: DateTime = DateTime.now();
  cause?: Cause | undefined;

  constructor(options: LogOptions<T>, environment: EnvironmentContext) {
    this.logKinds = options.logKinds || [LogKind.console, LogKind.http];
    this.code = options.code;
    this.namespace = options.namespace;
    this.tags = options.tags;
    this.message = options.message;
    this.data = options.data;
    this.version = options.version;
    this.cause = options.cause;
    this.environment = environment;
  }
}

export interface LogOptions<T extends AnyObject> {
  logKinds?: LogKind[] | undefined;
  namespace: string;
  code: string;
  tags: string[];
  message: (context: LogContext<T>) => string;
  data: T;
  version: SimpleVersion;
  cause?: Cause | undefined;
}
