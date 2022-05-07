export const promiseAllSettled = async <T>(promises: Promise<T>[]): Promise<PromiseSettledResults<T>> => {
  const promisedResults = await Promise.allSettled(promises);
  const results = promisedResults.reduce((results, promisedResult) => {
    if (promisedResult.status === 'fulfilled') {
      results.successes.push(promisedResult.value);
    } else {
      results.failures.push(promisedResult.reason);
    }

    return results;
  }, { successes: [], failures: [] } as PromiseSettledResults<T>);

  return results;
}

export interface PromiseSettledResults<T> {
  successes: T[];
  failures: any[];
}
