import { isProtocolRelativeUrl } from './isProtocolRelativeUrl';

export const isRelativeUrl = (url: string): boolean => {
  return url.startsWith('/') && !isProtocolRelativeUrl(url);
}
