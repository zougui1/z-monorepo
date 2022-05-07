export const compact = <T>(array: T[]): Exclude<T, undefined | null | false>[] => {
  return array.filter(Boolean) as Exclude<T, undefined | null>[];
}
