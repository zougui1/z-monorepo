export const toArray = <T>(value: T | readonly T[]): T[] => {
  return Array.isArray(value) ? value : [value];
}
