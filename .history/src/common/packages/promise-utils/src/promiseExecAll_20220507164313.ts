import { promiseAllSettled } from './promiseAllSettled';

export const promiseExecAll = async <TValue, TMeta>(entries: PromiseExecEntry<TValue, TMeta>[]): Promise<PromiseExecResults<TValue, TMeta>> => {
  const results = await promiseAllSettled(entries.map(entry => entry.exec()));
  const successes = results.successes.map(success => {
    return {
      ...success,
      metadata: entries[success.index].metadata,
    };
  });
  const failures = results.failures.map(failure => {
    return {
      ...failure,
      metadata: entries[failure.index].metadata,
    };
  });

  return { successes, failures };
}

export interface PromiseExecEntry<TValue, TMeta> {
  metadata: TMeta;
  exec: () => Promise<TValue>;
}

export interface PromiseExecResults<TValue, TMeta> {
  successes: { index: number; metadata: TMeta; value: TValue }[];
  failures: { index: number; metadata: TMeta; reason: any }[];
}
