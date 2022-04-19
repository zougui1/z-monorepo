import { isProtocolRelativeUrl } from './isProtocolRelativeUrl';

describe('isProtocolRelativeUrl()', () => {
  it('should return true when the URL starts with "//"', () => {
    const url = '//google.com';

    const isProtocolRelative = isProtocolRelativeUrl(url);

    expect(isProtocolRelative).toBe(true);
  });

  it('should return true when the URL does not start with "//"', () => {
    const url = 'https://google.com';

    const isProtocolRelative = isProtocolRelativeUrl(url);

    expect(isProtocolRelative).toBe(false);
  });
});
