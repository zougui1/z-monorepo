import { promiseAllSettled } from './promiseAllSettled';

export const promiseExecAll = async <TValue, TInput extends any[]>(entries: PromiseExecEntry<TValue, TInput>[]): Promise<PromiseExecResults<TValue, TInput>> => {
  const results = await promiseAllSettled(entries.map(entry => entry.exec()));
  const successes = results.successes.map(success => {
    return {
      ...success,
      input: entries[success.index].input,
      type: entries[success.index].type,
    };
  });
  const failures = results.failures.map(failure => {
    return {
      ...failure,
      input: entries[failure.index].input,
      type: entries[failure.index].type,
    };
  });

  return { successes, failures };
}

export interface PromiseExecEntry<TValue, TInput extends any[]> {
  input: TInput;
  type: string;
  exec: () => Promise<TValue>;
}

export interface PromiseExecResults<TValue, TInput extends any[]> {
  successes: { index: number; input: TInput; type: string; value: TValue }[];
  failures: { index: number; input: TInput; type: string; reason: any }[];
}
