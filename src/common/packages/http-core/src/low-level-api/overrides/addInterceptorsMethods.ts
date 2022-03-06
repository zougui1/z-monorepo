import {
  RequestInterceptor,
  ResponseInterceptor,
  HttpInstance,
  ErrorInterceptor,
  RequestInterceptorHandler,
  ResponseInterceptorHandler,
  HttpRequestConfig,
  HttpResponse,
} from '../../types';

export const addInterceptorsMethods = (http: HttpInstance): HttpInstance => {
  const requestInterceptors: RequestInterceptorHandler[] = [];
  const responseInterceptors: ResponseInterceptorHandler[] = [];
  const reqErrorInterceptors: ErrorInterceptor[] = [];
  const resErrorInterceptors: ErrorInterceptor[] = [];

  http.addRequestInterceptors = (...interceptors: RequestInterceptor[]) => {
    for (const { onResolved, onRejected } of interceptors) {
      if (onResolved) {
        requestInterceptors.push(onResolved);
      }

      if (onRejected) {
        reqErrorInterceptors.push(onRejected);
      }
    }
  }

  http.addResponseInterceptors = (...interceptors: ResponseInterceptor[]) => {
    for (const { onResolved, onRejected } of interceptors) {
      if (onResolved) {
        responseInterceptors.push(onResolved);
      }

      if (onRejected) {
        resErrorInterceptors.push(onRejected);
      }
    }
  }

  http.addErrorInterceptors = (...interceptors: ErrorInterceptor[]) => {
    reqErrorInterceptors.push(...interceptors);
    resErrorInterceptors.push(...interceptors);
  }

  http.interceptors.request.use(
    config => interceptRequest(config, requestInterceptors),
    error => interceptError(error, reqErrorInterceptors),
  );
  http.interceptors.response.use(
    response => interceptResponse(response, responseInterceptors),
    error => interceptError(error, resErrorInterceptors),
  );

  return http;
}

const interceptRequest = async (config: HttpRequestConfig, interceptors: RequestInterceptorHandler[]): Promise<HttpRequestConfig> => {
  for (const interceptor of interceptors) {
    config = await interceptor(config);
  }

  return config;
}

const interceptResponse = async (response: HttpResponse, interceptors: ResponseInterceptorHandler[]): Promise<HttpResponse> => {
  for (const interceptor of interceptors) {
    response = await interceptor(response);
  }

  return response;
}

const interceptError = async (error: any, interceptors: ErrorInterceptor[]) => {
  for (const interceptor of interceptors) {
    error = await interceptor(error);
  }

  if (error) {
    throw error;
  }
}
