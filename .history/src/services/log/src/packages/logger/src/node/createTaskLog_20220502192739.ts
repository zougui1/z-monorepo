import { nanoid } from 'nanoid';
import type { Constructor } from 'type-fest';

import { Cause } from '@zougui/common.error-utils';
import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';
import type { LogKind, LogContext } from '@zougui/log.log-types';

import { Log } from '../common';
import { createLog, LogArguments, RequiredLogData, RequiredLogCause } from './createLog';

export const createTaskLog = <
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
  >(logOptions: CreateTaskLogOptions): TaskLogs<TStartData, TSuccessData, TErrorCause> => {
  const options = { stackTraceLimit: 3 };
  const commonOptions = {
    taskId: nanoid(),
    logKinds: logOptions.logKinds,
    namespace: logOptions.namespace,
    tags: logOptions.tags,
    version: logOptions.version,
  };

  const start = createLog<TStartData, void>({
    ...commonOptions,
    code: `${logOptions.baseCode}.start`,
    message: logOptions.messages.start,
  }, options);

  const success = createLog<TSuccessData, void>({
    ...commonOptions,
    code: `${logOptions.baseCode}.success`,
    message: logOptions.messages.success,
  }, options);

  const error = createLog<void, TErrorCause>({
    ...commonOptions,
    code: `${logOptions.baseCode}.error`,
    message: logOptions.messages.error,
  }, options);

  return {
    start,
    success,
    error,
  };
}

export interface CreateTaskLogOptions<T extends UnknownObject | void = void> {
  logKinds?: LogKind[] | undefined;
  namespace: string;
  baseCode: string;
  tags?: string[] | undefined;
  messages: {
    start: ((context: LogContext<RequiredLogData<T>>) => string) | string;
    success: ((context: LogContext<RequiredLogData<T>>) => string) | string;
    error: ((context: LogContext<RequiredLogData<T>>) => string) | string;
  };
  version: SimpleVersion;
}

export interface TaskLogs<
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
> {
  start: Constructor<Log<RequiredLogData<TStartData>>, LogArguments<TStartData, void>>;
  success: Constructor<Log<RequiredLogData<TSuccessData>>, LogArguments<TSuccessData, void>>;
  error: Constructor<Log<{}, RequiredLogCause<TErrorCause>>, LogArguments<void, TErrorCause>>;
}
