import { getIsBrowser, getIsJsDom, getIsNode, getIsCommonJs } from './process-environment';

export const isJsDom = getIsJsDom();
export const isNode = getIsNode();
export const isBrowser = getIsBrowser();
export const isCommonJs = getIsCommonJs();
