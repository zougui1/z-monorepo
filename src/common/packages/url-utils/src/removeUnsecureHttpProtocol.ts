const reHttp = /^http:/g;

export const removeUnsecureHttpProtocol = (url: string): string => {
  return url.replace(reHttp, '');
}
