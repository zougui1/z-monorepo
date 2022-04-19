import { isRelativeUrl } from './isRelativeUrl';

describe('isRelativeUrl()', () => {
  it('should return true if the URL is relative', () => {
    const url = '/search';

    const isAbsolute = isRelativeUrl(url);

    expect(isAbsolute).toBe(true);
  });

  it('should return false if the URL is protocol relative', () => {
    const url = '//google.com/search';

    const isAbsolute = isRelativeUrl(url);

    expect(isAbsolute).toBe(false);
  });

  it('should return false if the URL is not relative', () => {
    const url = 'https://google.com/search';

    const isAbsolute = isRelativeUrl(url);

    expect(isAbsolute).toBe(false);
  });
});
