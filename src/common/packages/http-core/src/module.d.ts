export declare module 'axios' {
  export interface AxiosRequestConfig {
    requestId: string;
    params?: Record<string, any>;
  }

  export interface Cancel {
    config: AxiosRequestConfig;
  }

  export interface AxiosStatic {
    create(config?: Omit<AxiosRequestConfig, 'requestId'> | undefined): AxiosInstance;
  }
}
