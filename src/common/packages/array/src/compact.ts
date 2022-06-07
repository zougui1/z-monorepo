export const compact = <T>(array: T[] | readonly T[]): Exclude<T, undefined | null>[] | readonly Exclude<T, undefined | null>[] => {
  return array.filter(v => v !== undefined && v !== null) as Exclude<T, undefined | null>[];
}
