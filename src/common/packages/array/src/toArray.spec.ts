import { toArray } from './toArray';

describe('toArray()', () => {
  it('should return the value as is when it is an array', () => {
    const value = ['my value'];
    const result = toArray(value);

    expect(result).toEqual(value);
  });

  it('should return the value in an array when it is not an array', () => {
    const value = 'my value';
    const result = toArray(value);

    expect(result).toEqual([value]);
  });
});
