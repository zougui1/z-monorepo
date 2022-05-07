import StackTracey from 'stacktracey';
import type { Constructor } from 'type-fest';

import { toFunction } from '@zougui/common.function-utils';
import type { Cause } from '@zougui/common.error-utils';
import type { AnyObject, SimpleVersion } from '@zougui/common.type-utils';

import { Log, LogKind, LogContext } from '../common';

export const createLog = <T extends AnyObject>(options: CreateLogOptions<T>): Constructor<Log<T>> => {
  const stackTraceLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const stackFrame = new StackTracey(new Error().stack).at(1);
  Error.stackTraceLimit = stackTraceLimit;

  return class NewLog extends Log<T> {
    constructor() {
      super({
        ...options,
        message: toFunction(options.message),
      }, {} as any);
    }
  }
}

export interface CreateLogOptions<T extends AnyObject> {
  logKinds?: LogKind[] | undefined;
  namespace: string;
  code: string;
  tags: string[];
  message: ((context: LogContext<T>) => string) | string;
  data: T;
  version: SimpleVersion;
  cause?: Cause | undefined;
}
