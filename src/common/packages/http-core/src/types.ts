import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, Canceler } from 'axios';

export type InterceptorHandler<T> = (value: T) => T | Promise<T>;
export interface Interceptor<T> {
  onResolved?: InterceptorHandler<T>;
  onRejected?: ErrorInterceptor;
}

export type RequestInterceptorHandler = InterceptorHandler<HttpRequestConfig>;
export type RequestInterceptor = Interceptor<HttpRequestConfig>;
export type ResponseInterceptorHandler = InterceptorHandler<HttpResponse<any>>;
export type ResponseInterceptor = Interceptor<HttpResponse<any>>;
export type ErrorInterceptor = InterceptorHandler<any>;

export interface HttpRequestConfig extends AxiosRequestConfig {
  params?: Record<string, any>;
  requestId: string;
  cancellable?: boolean;
  secrets?: {
    data?: string[];
    params?: string[];
  };
}

export interface HttpResponse<T = any> extends AxiosResponse<T> {
  config: HttpRequestConfig;
}

export interface HttpError<T = any> extends AxiosError<T> {
  config: HttpRequestConfig;
  response?: AxiosResponse<T>;
}

export type HttpRequestConfigOptions = Omit<HttpRequestConfig, 'requestId'>;

export interface HttpInstance extends AxiosInstance {
  get: <T = any, R = HttpResponse<T>>(url: string, config?: HttpRequestConfigOptions) => CancellablePromise<R>;
  delete: <T = any, R = HttpResponse<T>>(url: string, config?: HttpRequestConfigOptions) => CancellablePromise<R>;
  head: <T = any, R = HttpResponse<T>>(url: string, config?: HttpRequestConfigOptions) => CancellablePromise<R>;
  options: <T = any, R = HttpResponse<T>>(url: string, config?: HttpRequestConfigOptions) => CancellablePromise<R>;
  post: <T = any, R = HttpResponse<T>>(url: string, data: any, config?: HttpRequestConfigOptions) => CancellablePromise<R>;
  put: <T = any, R = HttpResponse<T>>(url: string, data: any, config?: HttpRequestConfigOptions) => CancellablePromise<R>;
  patch: <T = any, R = HttpResponse<T>>(url: string, data: any, config?: HttpRequestConfigOptions) => CancellablePromise<R>;
  addRequestInterceptors: (...interceptors: RequestInterceptor[]) => void;
  addResponseInterceptors: (...interceptors: ResponseInterceptor[]) => void;
  addErrorInterceptors: (...interceptors: ErrorInterceptor[]) => void;
  baseUrl: string | undefined;
}

export interface CancellablePromise<T> extends Promise<T> {
  cancel: (reason?: string) => Canceler | undefined | void;
}

export type FetchFunctionWithBody =
  | HttpInstance['get']
  | HttpInstance['delete']
  | HttpInstance['head']
  | HttpInstance['options'];

export type FetchFunctionWithoutBody =
  | HttpInstance['post']
  | HttpInstance['put']
  | HttpInstance['patch'];

export type FetchFunction = FetchFunctionWithBody | FetchFunctionWithoutBody;

export type RouteComponent = {
  name: string;
  isParam: boolean;
  isOptional: boolean;
}

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';
