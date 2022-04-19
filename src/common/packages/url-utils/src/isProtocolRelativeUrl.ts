export const isProtocolRelativeUrl = (url: string): boolean => {
  return url.startsWith('//');
}
