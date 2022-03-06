import * as uuid from 'uuid';

import { HttpRequestConfig } from '../../types';

export const requestIdInterceptor = {
  onResolved: (config: HttpRequestConfig): HttpRequestConfig => {
    config.requestId = uuid.v4();

    // add the request ID to the cancel token's reason
    // to be usable when it is thrown
    if (config.cancelToken?.reason) {
      config.cancelToken.reason.config = config;
    }

    return config;
  },
};
