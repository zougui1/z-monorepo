import { setLocale } from 'yup';

setLocale({
  mixed: {
    default: ({ path, originalValue }) => ({ key: 'validation.invalidValue', values: { path, originalValue } }),
    required: ({ path, originalValue }) => ({ key: 'validation.required', values: { path, originalValue } }),
    defined: ({ path, originalValue }) => ({ key: 'validation.defined', values: { path, originalValue } }),
    oneOf: ({ path, originalValue, values }) => ({ key: 'validation.oneOf', values: { path, originalValue, values } }),
    notOneOf: ({ path, originalValue, values }) => ({ key: 'validation.notOneOf', values: { path, originalValue, values } }),
    notType: ({ path, originalValue, type }) => ({ key: 'validation.notType', values: { path, originalValue, type } }),
  },

  string: {
    min: ({ path, originalValue, min }) => ({ key: 'validation.string.minLength', values: { path, originalValue, min } }),
    max: ({ path, originalValue, max }) => ({ key: 'validation.string.maxLength', values: { path, originalValue, max } }),
    length: ({ path, originalValue, length }) => ({ key: 'validation.string.length', values: { path, originalValue, length } }),
    matches: ({ path, originalValue, regex }) => ({ key: 'validation.matches', values: { path, originalValue, regex } }),
    email: ({ path, originalValue }) => ({ key: 'validation.email', values: { path, originalValue } }),
    url: ({ path, originalValue }) => ({ key: 'validation.url', values: { path, originalValue } }),
    uuid: ({ path, originalValue }) => ({ key: 'validation.uuid', values: { path, originalValue } }),
    trim: ({ path, originalValue }) => ({ key: 'validation.trim', values: { path, originalValue } }),
    lowercase: ({ path, originalValue }) => ({ key: 'validation.lowercase', values: { path, originalValue } }),
    uppercase: ({ path, originalValue }) => ({ key: 'validation.uppercase', values: { path, originalValue } }),
  },

  number: {
    min: ({ path, originalValue, min }) => ({ key: 'validation.min', values: { path, originalValue, min } }),
    max: ({ path, originalValue, max }) => ({ key: 'validation.max', values: { path, originalValue, max } }),
    integer: ({ path, originalValue }) => ({ key: 'validation.integer', values: { path, originalValue } }),
    lessThan: ({ path, originalValue, less }) => ({ key: 'validation.lessThan', values: { path, originalValue, less } }),
    moreThan: ({ path, originalValue, more }) => ({ key: 'validation.moreThan', values: { path, originalValue, more } }),
    negative: ({ path, originalValue }) => ({ key: 'validation.negative', values: { path, originalValue } }),
    positive: ({ path, originalValue }) => ({ key: 'validation.positive', values: { path, originalValue } }),
  },

  date: {
    min: ({ path, originalValue, min }) => ({ key: 'validation.minDate', values: { path, originalValue, min } }),
    max: ({ path, originalValue, max }) => ({ key: 'validation.maxDate', values: { path, originalValue, max } }),
  },

  boolean: {
    isValue: ({ path, originalValue, value }) => ({ key: 'validation.notValue', values: { path, originalValue, value } }),
  },

  object: {
    noUnknown: ({ path, originalValue }) => ({ key: 'validation.noUnknown', values: { path, originalValue } }),
  },

  array: {
    min: ({ path, originalValue, min }) => ({ key: 'validation.array.minLength', values: { path, originalValue, min } }),
    max: ({ path, originalValue, max }) => ({ key: 'validation.array.maxLength', values: { path, originalValue, max } }),
    length: ({ path, originalValue, length }) => ({ key: 'validation.array.length', values: { path, originalValue, length } }),
  },
});
