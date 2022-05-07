import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';

import { toFunction } from '@zougui/common.function-utils';
import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';
import type { Cause } from '@zougui/common.error-utils';

import { LogKind } from './LogKind';
import { LogType } from './LogType';
import type { LogObject } from './LogObject';
import type { EnvironmentContext } from './EnvironmentContext';
import type { LogContext } from './LogContext';

export class Log<TData extends UnknownObject = UnknownObject, TCause extends Cause | undefined = undefined> implements LogObject<TData> {
  logKinds: LogKind[];
  type: LogType;
  logId: string = nanoid();
  code: string;
  namespace: string;
  tags: string[];
  getMessage: (context: LogContext<TData>) => string;
  data: TData;
  environment: EnvironmentContext;
  version: SimpleVersion;
  createdAt: DateTime = DateTime.now();
  cause?: TCause;

  constructor(options: LogOptions<TData, TCause>, environment: EnvironmentContext) {
    this.logKinds = options.logKinds || [LogKind.console, LogKind.http];
    this.type = options.type || LogType.simpleLog;
    this.code = options.code;
    this.namespace = options.namespace;
    this.tags = options.tags;
    this.getMessage = toFunction(options.message);
    this.data = options.data;
    this.version = options.version;
    this.cause = options.cause;
    this.environment = environment;
  }
}

export interface LogOptions<T extends UnknownObject, TCause extends Cause | undefined = undefined> {
  logKinds?: LogKind[] | undefined;
  type?: LogType | undefined;
  namespace: string;
  code: string;
  tags: string[];
  message: ((context: LogContext<T>) => string) | string;
  data: T;
  version: SimpleVersion;
  cause?: TCause;
}
