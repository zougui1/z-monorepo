export const prefixWith = (str: string, prefix: string): string => {
  return str.startsWith(prefix) ? str : `${prefix}${str}`;
}
