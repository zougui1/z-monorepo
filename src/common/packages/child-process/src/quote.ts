const reNoSpecialChar = /^[a-z0-9/_.-]+$/i;

export const quote = (arg: string): string => {
  if (reNoSpecialChar.test(arg) || arg === '') {
    return arg;
  }

  const sanitizedArg = arg
    .replace(/\\/g, '\\\\')
    .replace(/'/g, '\\\'')
    .replace(/\f/g, '\\f')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\v/g, '\\v')
    .replace(/\0/g, '\\0');

  return sanitizedArg;
}
