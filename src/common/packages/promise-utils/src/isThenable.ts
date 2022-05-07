export const isThenable = (value: unknown): value is { then: (...args: unknown[]) => unknown } => {
  return Boolean(
    value &&
    typeof value === 'object' &&
    typeof (value as any).then === 'function'
  );
}
