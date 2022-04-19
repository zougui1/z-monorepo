import { prefixWith } from './prefixWith';

describe('prefixWith()', () => {
  it('should return the string as is if the prefix is already present', () => {
    const str = 'some-prefix some text';
    const prefix = 'some-prefix';

    const prefixedString = prefixWith(str, prefix);

    expect(prefixedString).toBe(str);
  });

  it('should return the string prefixed if the prefix is not present', () => {
    const str = 'some text';
    const prefix = 'some-prefix';
    const expectedPrefixedString = `${prefix}${str}`

    const prefixedString = prefixWith(str, prefix);

    expect(prefixedString).toBe(expectedPrefixedString);
  });
});
