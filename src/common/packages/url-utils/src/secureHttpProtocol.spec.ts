import { secureHttpProtocol } from './secureHttpProtocol';

describe('secureHttpProtocol()', () => {
  it('should return the URL as is if it is the protocol HTTPS', () => {
    const url = 'https://google.com';

    const securedUrl = secureHttpProtocol(url);

    expect(securedUrl).toBe(url);
  });

  it('should return the URL with the protocol HTTPS if it has no protocol', () => {
    const url = '//google.com';
    const expectedSecuredUrl = `https:${url}`;

    const securedUrl = secureHttpProtocol(url);

    expect(securedUrl).toBe(expectedSecuredUrl);
  });

  it('should return the URL with the protocol HTTPS if it has the protocol HTTP', () => {
    const url = 'http://google.com';
    const expectedSecuredUrl = 'https://google.com';

    const securedUrl = secureHttpProtocol(url);

    expect(securedUrl).toBe(expectedSecuredUrl);
  });
});
