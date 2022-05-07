export const toFunction = <T>(value: T | (() => T)): (() => T) => {
  return typeof value === 'function'
    ? value as () => T
    : () => value;
}
