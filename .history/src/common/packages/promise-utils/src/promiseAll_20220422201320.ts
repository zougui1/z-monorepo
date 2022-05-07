import { PromiseValue } from 'type-fest';

export const promiseAll = async <T extends Record<string, Promise<any>>>(promises: T): Promise<ResolvedAllFromObject<T>> => {
  const promisesEntries = Object.entries(promises) as [keyof T, T[keyof T]][];
  const promiseList = promisesEntries.map(async ([key, promise]) => {
    const value = await promise;
    return { key, value };
  });
  const values = await Promise.all(promiseList);

  const valuesObject = values.reduce((valuesObject, { key, value }) => {
    valuesObject[key] = value;
    return valuesObject;
  }, {} as ResolvedAllFromObject<T>);

  return valuesObject;
}

export type ResolvedAllFromObject<T extends Record<string, Promise<any>>> = {
  [Key in keyof T]: Awaited<T[Key]>
}

(async () => {
  const { str, num } = await promiseAll({
    str: Promise.resolve(''),
    num: Promise.resolve(0),
  });
})();
