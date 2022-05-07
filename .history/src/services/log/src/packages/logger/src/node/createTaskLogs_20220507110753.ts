import { nanoid } from 'nanoid';
import { Stopwatch } from '@zougui/common.stopwatch';
import type { Constructor, PromiseValue } from 'type-fest';

import { Cause } from '@zougui/common.error-utils';
import { wrapFunction, toFunction } from '@zougui/common.function-utils';
import { isThenable } from '@zougui/common.promise-utils';
import type { UnknownObject, SimpleVersion, AnyObject } from '@zougui/common.type-utils';
import type { LogKind, LogContext, LogTimings } from '@zougui/log.log-types';

import { Log, logger } from '../common';
import { createLog, LogArguments, RequiredLogData, RequiredLogCause } from './createLog';

type ResolvedResultData<T> = T extends any[] ? { result: T } : T;

const getTimings = (stopwatch: Stopwatch): LogTimings => {
  const timing = stopwatch.stop().total;
  const timingMilliseconds = stopwatch.timings.total;

  return {
    raw: timingMilliseconds,
    formatted: timing,
  };
}
export const createTaskLogs = <
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
>(
  logOptions: CreateTaskLogsOptions<TStartData, ResolvedResultData<TSuccessData>, TErrorCause>,
): TaskLogsConstructor<TStartData, ResolvedResultData<TSuccessData>, TErrorCause> => {
  const commonOptions = { stackTraceLimit: 3 };
  const commonLogOptions = {
    logKinds: logOptions.logKinds,
    namespace: logOptions.namespace,
    tags: logOptions.tags,
    version: logOptions.version,
  };

  const StartLog = createLog<TStartData, void>(
    {
      ...commonLogOptions,
      code: `${logOptions.baseCode}.start`,
      message: logOptions.messages?.start || '',
    },
    commonOptions,
  );

  const SuccessLog = createLog<ResolvedResultData<TSuccessData>, void>(
    {
      ...commonLogOptions,
      code: `${logOptions.baseCode}.success`,
      message: logOptions.messages?.success || '',
    },
    commonOptions,
  );

  const ErrorLog = createLog<void, TErrorCause>(
    {
      ...commonLogOptions,
      code: `${logOptions.baseCode}.error`,
      message: logOptions.messages?.error || '',
    },
    commonOptions,
  );

  class TaskLog {
    taskId: string = nanoid();
    stopwatch: Stopwatch = new Stopwatch();

    static #formatters: {
      start?: ((data: TStartData) => UnknownObject) | undefined;
      success?: ((data: TSuccessData) => UnknownObject) | undefined;
      error?: ((data: TErrorCause) => Cause) | undefined;
    } | undefined;

    static #messages: {
      start?: ((context: LogContext<RequiredLogData<TStartData>>) => string) | string | undefined;
      success?: ((context: LogContext<RequiredLogData<TSuccessData>>) => string) | string | undefined;
      error?: ((context: LogContext<UnknownObject, RequiredLogCause<TErrorCause>>) => string) | string | undefined;
    } | undefined;

    constructor() {
      if (!logOptions.messages?.start && !TaskLog.#messages?.start) {
        throw new Error('Can\'t build a task log without a start message.');
      }
      if (!logOptions.messages?.success && !TaskLog.#messages?.success) {
        throw new Error('Can\'t build a task log without a success message.');
      }
      if (!logOptions.messages?.error && !TaskLog.#messages?.error) {
        throw new Error('Can\'t build a task log without an error message.');
      }
    }

    static formatters = (formatters: {
      start?: ((data: TStartData) => UnknownObject) | undefined;
      success?: ((data: TSuccessData) => UnknownObject) | undefined;
      error?: ((data: TErrorCause) => Cause) | undefined;
    }): Constructor<TaskLog> => {
      TaskLog.#formatters = formatters;
      return TaskLog;
    }

    static messages = (messages: {
      start?: ((context: LogContext<RequiredLogData<TStartData>>) => string) | string | undefined;
      success?: ((context: LogContext<RequiredLogData<TSuccessData>>) => string) | string | undefined;
      error?: ((context: LogContext<UnknownObject, RequiredLogCause<TErrorCause>>) => string) | string | undefined;
    }): Constructor<TaskLog> => {
      TaskLog.#messages = messages;
      return TaskLog;
    }

    static wrap = <TFunc extends (...args: any[]) => any>(func: TFunc): ((...args: Parameters<TFunc>) => ReturnType<TFunc>) => {
      return (...args) => {
        const task = new TaskLog();

        // @ts-ignore
        logger.info(task.start({ data: { args } }));
        const res = wrapFunction<ReturnType<TFunc>>(() => func(...args), {
          onResolve: result => {
            // @ts-ignore
            logger.success(task.success({ data: { result } }));
            //console.log(task.success({ data: { result } }).data)
          },
          onReject: cause => {
            // @ts-ignore
            const log = task.error({ cause });
            logger.error(log);
            throw log.cause;
            //console.log(task.success({ cause }).cause?.message);
          },
        });

        if (isThenable(res)) {
          return res.then((result: PromiseValue<ReturnType<TFunc>>) => ({ result }));
        }

        return res;
      }
    }

    start = (...args: LogArguments<TStartData, void>): Log<RequiredLogData<TStartData>, undefined> => {
      const inputData = args[0]?.data;
      const outputData = inputData && TaskLog.#formatters?.start && TaskLog.#formatters.start(inputData as TStartData);
      const actualData = outputData || inputData;
      const actualArgs = actualData ? [
        {
          ...(args[0] || {}),
          data: actualData,
        },
        ...args.slice(1),
      ] as LogArguments<TStartData, void> : args;

      const log = new StartLog(...actualArgs);
      log.getMessage = TaskLog.#messages?.start
        ? toFunction(TaskLog.#messages.start)
        : log.getMessage;

      log.taskId = this.taskId;
      this.stopwatch.start();

      return log;
    }

    success = (...args: LogArguments<ResolvedResultData<TSuccessData>, void>): Log<RequiredLogData<TSuccessData>, undefined> => {
      const inputData = args[0]?.data;
      const outputData = inputData && TaskLog.#formatters?.success && TaskLog.#formatters.success(inputData as TSuccessData);
      const actualData = outputData || inputData;
      const actualArgs = actualData ? [
        {
          ...(args[0] || {}),
          data: actualData,
        },
        ...args.slice(1),
      ] as LogArguments<ResolvedResultData<TSuccessData>, void> : args;

      const log = new SuccessLog(...actualArgs);
      log.getMessage = TaskLog.#messages?.success
        ? toFunction(TaskLog.#messages.success) as any
        : log.getMessage;

      log.taskId = this.taskId;
      log.timings = getTimings(this.stopwatch);

      return log as any;
    }

    error = (...args: LogArguments<void, TErrorCause>): Log<{}, RequiredLogCause<TErrorCause>> => {
      const inputCause = args[0]?.cause;
      const outputCause = inputCause && TaskLog.#formatters?.error && TaskLog.#formatters.error(inputCause as TErrorCause);
      const actualCause = outputCause || inputCause;
      const actualArgs = actualCause ? [
        {
          ...(args[0] || {}),
          cause: actualCause,
        },
        ...args.slice(1),
      ] as LogArguments<void, TErrorCause> : args;

      const log = new ErrorLog(...actualArgs);
      log.getMessage = TaskLog.#messages?.error
        ? toFunction(TaskLog.#messages.error)
        : log.getMessage;

      log.taskId = this.taskId;
      log.timings = getTimings(this.stopwatch);

      return log;
    }
  }

  return TaskLog as any;
}

export interface CreateTaskLogsOptions<
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
> {
  logKinds?: LogKind[] | undefined;
  namespace: string;
  baseCode: string;
  tags?: string[] | undefined;
  messages?: {
    start?: ((context: LogContext<RequiredLogData<TStartData>>) => string) | string | undefined;
    success?: ((context: LogContext<RequiredLogData<TSuccessData>>) => string) | string | undefined;
    error?: ((context: LogContext<UnknownObject, RequiredLogCause<TErrorCause>>) => string) | string | undefined;
  } | undefined;
  version: SimpleVersion;
}

export interface TaskLogs<
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
  TStartDataOut extends UnknownObject | void = TStartData,
  TSuccessDataOut extends UnknownObject | void = TSuccessData,
  TErrorCauseOut extends Cause | void = TErrorCause,
> {
  start: (...args: LogArguments<TStartData, void>) => Log<RequiredLogData<TStartDataOut>>;
  success: (...args: LogArguments<TSuccessData, void>) => Log<RequiredLogData<TSuccessDataOut>>;
  error: (...args: LogArguments<void, TErrorCause>) => Log<{}, RequiredLogCause<TErrorCauseOut>>;
}

export type TaskLogsConstructor<
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
  TStartDataOut extends UnknownObject | void = TStartData,
  TSuccessDataOut extends UnknownObject | void = TSuccessData,
  TErrorCauseOut extends Cause | void = TErrorCause,
> = {
  formatters: <
    NewTStartDataOut extends UnknownObject | undefined = undefined,
    NewTSuccessDataOut extends UnknownObject | undefined = undefined,
    NewTErrorCauseOut extends Cause | undefined = undefined,
  >(
    formatters: {
      start?: ((data: TStartData) => NewTStartDataOut) | undefined;
      success?: ((data: TSuccessData) => NewTSuccessDataOut) | undefined;
      error?: ((cause: TErrorCause) => NewTErrorCauseOut) | undefined;
    }
  ) => TaskLogsConstructor<
    TStartData,
    TSuccessData,
    TErrorCause,
    NewTStartDataOut extends undefined ? TStartDataOut : NewTStartDataOut,
    NewTSuccessDataOut extends undefined ? TSuccessDataOut : NewTSuccessDataOut,
    NewTErrorCauseOut extends undefined ? TErrorCauseOut : NewTErrorCauseOut
  >;

  messages(messages: {
    start?: ((context: LogContext<RequiredLogData<TStartDataOut>>) => string) | string | undefined;
    success?: ((context: LogContext<RequiredLogData<TSuccessDataOut>>) => string) | string | undefined;
    error?: ((context: LogContext<UnknownObject, RequiredLogCause<TErrorCauseOut>>) => string) | string | undefined;
  }): TaskLogsConstructor<
    TStartData,
    TSuccessData,
    TErrorCause,
    TStartDataOut,
    TSuccessDataOut,
    TErrorCauseOut
  >;

  wrap: Args<TStartData> extends any[]
    ? <TFunc extends (...args: any[]) => any>(
      func: PromiseValue<ReturnType<TFunc>> extends Result<TSuccessData>
        ? Parameters<TFunc> extends Args<TStartData>
          ? TFunc
          : void
        : void
    ) => ((...args: Args<TStartData> extends any[] ? Args<TStartData> : any[]) => Promisify<ReturnType<TFunc>, Result<TSuccessData>, TSuccessData>)
    : void;
} & Constructor<TaskLogs<TStartData, TSuccessData, TErrorCause, TStartDataOut, TSuccessDataOut, TErrorCauseOut>>;

type Args<T> = T extends AnyObject ? T['args'] extends any[] ? T['args'] : void : void;
type Result<T> = T extends AnyObject ? T['result'] extends any[] ? T['result'] : void : void;
type IsPromise<T, Type> = T extends Type ? void : T extends Promise<Type> ? boolean : void;
type Promisify<T, ReturnedType, FinalType> = IsPromise<T, ReturnedType> extends void ? FinalType : Promise<FinalType>;
