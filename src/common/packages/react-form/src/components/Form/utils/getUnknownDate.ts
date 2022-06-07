export const getUnknownDate = (value: unknown): Date | null => {
  if(value instanceof Date) {
    return value;
  }

  // milliseconds from luxon json object
  const milliseconds = (value as any)?.ts;

  if (milliseconds) {
    return new Date(milliseconds);
  }

  return null;
}
