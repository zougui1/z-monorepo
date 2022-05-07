import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';

import { toFunction } from '@zougui/common.function-utils';
import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';
import type { Cause } from '@zougui/common.error-utils';
import {
  LogType,
  LogKind,
  LogObject,
  EnvironmentContext,
  LogContext,
} from '@zougui/log.log-types';

export class Log<TData extends UnknownObject = UnknownObject, TCause extends Cause | undefined = undefined> implements LogObject<TData> {
  logKinds: LogKind[];
  type: LogType;
  logId: string = nanoid();
  code: string;
  timings?: LogTimings | undefined;
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
    this.timings = options.timings;
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
  timings?: LogTimings | undefined;
  tags: string[];
  message: ((context: LogContext<T>) => string) | string;
  data: T;
  version: SimpleVersion;
  cause?: TCause;
}

export interface LogTimings {
  formatted: string;
  raw: number;
}
