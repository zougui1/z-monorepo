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

export const isIterableType = (type: Types): boolean => {
  return iterableObjectMap[type];
}

const iterableObjectMap = {
  array: true,
  iterable: true,
  object: true,
  string: false,
  number: false,
  boolean: false,
  undefined: false,
  null: false,
  function: false,
  bigint: false,
  symbol: false,
};

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
