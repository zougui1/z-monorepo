export const promiseAllSettled = async <T>(promises: Promise<T>[]): Promise<PromiseSettledResults<T>> => {
  const promisedResults = await Promise.allSettled(promises);
  const results = promisedResults.reduce((results, promisedResult, index) => {
    if (promisedResult.status === 'fulfilled') {
      results.successes.push({
        index,
        value: promisedResult.value,
      });
    } else {
      results.failures.push({
        index,
        reason: promisedResult.reason,
      });
    }

    return results;
  }, { successes: [], failures: [] } as PromiseSettledResults<T>);

  console.log('successes', (results as any).successes.map((s: any) => s.url))

  return results;
}

export interface PromiseSettledResults<T> {
  successes: { index: number; value: T }[];
  failures: { index: number; reason: any }[];
}
