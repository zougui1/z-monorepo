import type { DurationString, Unit } from './types';

// Helpers.
const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;
export const reDurationString = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i;

interface Options {
  /**
   * Set to `true` to use verbose formatting. Defaults to `false`.
   */
  long?: boolean;
}

/**
 * Parse or format the given `val`.
 *
 * @param value - The string or number to convert
 * @param options - Options for the conversion
 * @throws Error if `value` is not a non-empty string or a number
 */
export function ms(value: DurationString, options?: Options): number;
export function ms(value: number, options?: Options): string;
export function ms(value: DurationString | number, options?: Options): number | string {
  try {
    if (typeof value === 'string' && value.length > 0) {
      return parse(value);
    } else if (typeof value === 'number' && isFinite(value)) {
      return options?.long ? fmtLong(value) : fmtShort(value);
    }

    throw new Error('Value is not a string or number.');
  } catch (error) {
    /* istanbul ignore next */
    const message = isError(error)
      ? `${error.message}. value=${JSON.stringify(value)}`
      : 'An unknown error has occured.';

    throw new Error(message);
  }
}

/**
 * Parse the given `str` and return milliseconds.
 */
function parse(str: string): number {
  str = String(str);

  if (str.length > 100) {
    throw new Error('Value exceeds the maximum length of 100 characters.');
  }

  const match = reDurationString.exec(str);

  if (!match) {
    return NaN;
  }

  const n = parseFloat(match[1]);
  const type = (match[2] || 'ms').toLowerCase() as Lowercase<Unit>;

  /* istanbul ignore next */
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;

    case 'weeks':
    case 'week':
    case 'w':
      return n * w;

    case 'days':
    case 'day':
    case 'd':
      return n * d;

    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;

    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;

    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;

    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;

    default:
      // This should never occur.
      /* istanbul ignore next */
      throw new Error(
        `The unit ${type as string} was matched, but no matching case exists.`,
      );
  }
}

/**
 * Short format for `ms`.
 */
function fmtShort(ms: number): DurationString {
  const msAbs = Math.abs(ms);

  if (msAbs >= d) {
    return `${Math.round(ms / d)}d`;
  }

  if (msAbs >= h) {
    return `${Math.round(ms / h)}h`;
  }

  if (msAbs >= m) {
    return `${Math.round(ms / m)}m`;
  }

  if (msAbs >= s) {
    return `${Math.round(ms / s)}s`;
  }

  return `${ms}ms`;
}

/**
 * Long format for `ms`.
 */
function fmtLong(ms: number): DurationString {
  const msAbs = Math.abs(ms);

  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }

  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }

  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }

  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }

  return `${ms} ms`;
}

/**
 * Pluralization helper.
 */
function plural(
  ms: number,
  msAbs: number,
  n: number,
  name: string,
): DurationString {
  const isPlural = msAbs >= n * 1.5;
  return `${Math.round(ms / n)} ${name}${isPlural ? 's' : ''}` as DurationString;
}

/**
 * A type guard for errors.
 */
function isError(error: unknown): error is Error {
  return typeof error === 'object' && error !== null && 'message' in error;
}
