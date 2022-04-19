export const isMessageObject = (value: unknown): value is { message: unknown } => {
  return !!(
    value &&
    typeof value === 'object' &&
    'message' in value
  );
}
