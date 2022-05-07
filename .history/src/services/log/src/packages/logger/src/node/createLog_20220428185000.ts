import StackTracey from 'stacktracey';
import type { Constructor } from 'type-fest';

import { toFunction } from '@zougui/common.function-utils';
import { getLimitedStackTrace, Cause } from '@zougui/common.error-utils';
import type { AnyObject, SimpleVersion } from '@zougui/common.type-utils';

import { getEnvironmentContext } from './getEnvironmentContext';
import { Log, LogKind, LogContext } from '../common';

export const createLog = <T extends AnyObject>(options: CreateLogOptions<T>): Constructor<Log<T>> => {
  const stackFrame = new StackTracey(getLimitedStackTrace({ limit: 2 })).at(1);

  return class NewLog extends Log<T> {
    constructor() {
      super(
        {
        ...options,
        message: toFunction(options.message),
        },
        getEnvironmentContext({ stackFrame }),
      );
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
