import { prefixWith } from '@zougui/common.string-utils';

import { removeUnsecureHttpProtocol } from './removeUnsecureHttpProtocol';

export const secureHttpProtocol = (url: string): string => {
  return prefixWith(removeUnsecureHttpProtocol(url), 'https:');
}
