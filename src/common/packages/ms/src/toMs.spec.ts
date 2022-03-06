import { toMs } from './toMs';

describe('ms(string)', () => {
  it('should not throw an error', () => {
    expect(() => toMs('1m')).not.toThrowError();
  });

  it('should preserve ms', () => {
    expect(toMs('100')).toBe(100);
  });

  it('should convert from m to ms', () => {
    expect(toMs('1m')).toBe(60000);
  });

  it('should convert from h to ms', () => {
    expect(toMs('1h')).toBe(3600000);
  });

  it('should convert d to ms', () => {
    expect(toMs('2d')).toBe(172800000);
  });

  it('should convert w to ms', () => {
    expect(toMs('3w')).toBe(1814400000);
  });

  it('should convert s to ms', () => {
    expect(toMs('1s')).toBe(1000);
  });

  it('should convert ms to ms', () => {
    expect(toMs('100ms')).toBe(100);
  });

  it('should convert y to ms', () => {
    expect(toMs('1y')).toBe(31557600000);
  });

  it('should work with decimals', () => {
    expect(toMs('1.5h')).toBe(5400000);
  });

  it('should work with multiple spaces', () => {
    expect(toMs('1   s')).toBe(1000);
  });

  it('should return NaN if invalid', () => {
    // @ts-expect-error - We expect this to fail.
    expect(isNaN(toMs('☃'))).toBe(true);
    // @ts-expect-error - We expect this to fail.
    expect(isNaN(toMs('10-.5'))).toBe(true);
  });

  it('should be case-insensitive', () => {
    expect(toMs('1.5H')).toBe(5400000);
  });

  it('should work with numbers starting with .', () => {
    expect(toMs('.5ms')).toBe(0.5);
  });

  it('should work with negative integers', () => {
    expect(toMs('-100ms')).toBe(-100);
  });

  it('should work with negative decimals', () => {
    expect(toMs('-1.5h')).toBe(-5400000);
    expect(toMs('-10.5h')).toBe(-37800000);
  });

  it('should work with negative decimals starting with "."', () => {
    expect(toMs('-.5h')).toBe(-1800000);
  });
});

// long strings

describe('ms(long string)', () => {
  it('should not throw an error', () => {
    expect(() => toMs('53 milliseconds')).not.toThrowError();
  });

  it('should convert milliseconds to ms', () => {
    expect(toMs('53 milliseconds')).toBe(53);
  });

  it('should convert msecs to ms', () => {
    expect(toMs('17 msecs')).toBe(17);
  });

  it('should convert sec to ms', () => {
    expect(toMs('1 sec')).toBe(1000);
  });

  it('should convert from min to ms', () => {
    expect(toMs('1 min')).toBe(60000);
  });

  it('should convert from hr to ms', () => {
    expect(toMs('1 hr')).toBe(3600000);
  });

  it('should convert days to ms', () => {
    expect(toMs('2 days')).toBe(172800000);
  });

  it('should convert weeks to ms', () => {
    expect(toMs('1 week')).toBe(604800000);
  });

  it('should convert years to ms', () => {
    expect(toMs('1 year')).toBe(31557600000);
  });

  it('should work with decimals', () => {
    expect(toMs('1.5 hours')).toBe(5400000);
  });

  it('should work with negative integers', () => {
    expect(toMs('-100 milliseconds')).toBe(-100);
  });

  it('should work with negative decimals', () => {
    expect(toMs('-1.5 hours')).toBe(-5400000);
  });

  it('should work with negative decimals starting with "."', () => {
    expect(toMs('-.5 hr')).toBe(-1800000);
  });
});

// numbers

describe('ms(number)', () => {
  it('should not throw an error', () => {
    expect(() => toMs(500)).not.toThrowError();
  });

  it('should return the value as is', () => {
    expect(toMs(500)).toBe(500);
    expect(toMs(-500)).toBe(-500);
  });
});

// invalid inputs

describe('ms(invalid inputs)', () => {
  it('should throw an error, when ms("")', () => {
    expect(() => {
      // @ts-expect-error - We expect this to throw.
      toMs('');
    }).toThrowError();
  });

  it('should throw an error, when ms(undefined)', () => {
    expect(() => {
      // @ts-expect-error - We expect this to throw.
      toMs(undefined);
    }).toThrowError();
  });

  it('should throw an error, when ms(null)', () => {
    expect(() => {
      // @ts-expect-error - We expect this to throw.
      toMs(null);
    }).toThrowError();
  });

  it('should throw an error, when ms([])', () => {
    expect(() => {
      // @ts-expect-error - We expect this to throw.
      toMs([]);
    }).toThrowError();
  });

  it('should throw an error, when ms({})', () => {
    expect(() => {
      // @ts-expect-error - We expect this to throw.
      toMs({});
    }).toThrowError();
  });

  it('should throw an error, when ms(NaN)', () => {
    expect(() => toMs(NaN)).toThrowError();
  });

  it('should throw an error, when ms(Infinity)', () => {
    expect(() => toMs(Infinity)).toThrowError();
  });

  it('should throw an error, when ms(-Infinity)', () => {
    expect(() => toMs(-Infinity)).toThrowError();
  });
});
