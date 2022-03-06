import { requestIdInterceptor } from './requestIdInterceptor';
//! an error while logging when it fails
//import { requestLoggerInterceptor, responseLoggerInterceptor } from './loggerInterceptors';

export const defaultRequestInterceptors = [
  //! important: this interceptor MUST be the first one
  //! so that all the other interceptors can use the
  //! request ID if necessary
  requestIdInterceptor,
  //requestLoggerInterceptor,
];
export const defaultResponseInterceptors = [
  //responseLoggerInterceptor,
];
