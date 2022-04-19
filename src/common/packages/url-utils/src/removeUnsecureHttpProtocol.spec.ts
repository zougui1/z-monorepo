import { removeUnsecureHttpProtocol } from './removeUnsecureHttpProtocol';

describe('removeUnsecureHttpProtocol()', () => {
  it('should return the URL without the protocol if it is the protocol HTTP', () => {
    const url = 'http://google.com';
    const expectedUrl = '//google.com';

    const resultUrl = removeUnsecureHttpProtocol(url);

    expect(resultUrl).toBe(expectedUrl);
  });

  it('should return the URL as is it is the protocol HTTPS', () => {
    const url = 'https://google.com';

    const resultUrl = removeUnsecureHttpProtocol(url);

    expect(resultUrl).toBe(url);
  });

  it('should return the URL as is if it has no protocol', () => {
    const url = '//google.com';

    const resultUrl = removeUnsecureHttpProtocol(url);

    expect(resultUrl).toBe(url);
  });
});
