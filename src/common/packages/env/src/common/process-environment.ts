export const getIsJsDom = (): boolean => {
  return (
    typeof navigator === 'object' &&
    !!navigator &&
    !!navigator.userAgent &&
    navigator.userAgent.includes('jsdom')
  );
}

export const getIsNode = (): boolean => {
  return (
    typeof process === 'object' &&
    !!process &&
    !!process.versions &&
    !!process.versions.node
  );
}

export const getIsBrowser = (): boolean => {
  return (
    typeof window === 'object' &&
    typeof document === 'object' &&
    document.nodeType === 9
  );
}

export const getIsCommonJs = (): boolean => {
  return typeof module === 'object';
}
