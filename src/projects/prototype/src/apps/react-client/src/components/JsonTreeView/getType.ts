export const getType = (value: unknown): Types => {
  if (value === null) {
    return 'null';
  }

  if(Array.isArray(value)) {
    return 'array';
  }

  if (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as any)[Symbol.iterator] === 'function'
  ) {
    return 'iterable';
  }

  return typeof value;
}

export type Types =
  | 'array'
  | 'string'
  | 'number'
  | 'boolean'
  | 'undefined'
  | 'null'
  | 'iterable'
  | 'function'
  | 'bigint'
  | 'symbol'
  | 'object';
