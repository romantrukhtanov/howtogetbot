import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

import { API_URLS } from 'shared/helpers/apiUrls';

export type Options = AxiosRequestConfig;

class HttpActions {
  constructor() {
    const config: AxiosRequestConfig<never> = {
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    this.request = axios.create(config);

    axiosRetry(this.request, {
      retryDelay: retryCount => {
        return retryCount * 1000;
      },
      retryCondition: error => {
        return !error.response || error.response.status === 0;
      },
    });

    this.request.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        const response: AxiosResponse | undefined = error?.response;

        if (response) {
          if (response.status === 0) {
            return Promise.resolve();
          }

          // If backend sends error text in payload we want to know about it
          if (response.data?.error) {
            console.error(response.data.error);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private readonly request: AxiosInstance;

  public get apiUrl() {
    return API_URLS.api;
  }

  public get<T>(url: string, params?: object, options?: Options): AxiosPromise<T> {
    const config = { params, options };
    return this.request.get(url, config);
  }

  public post<T, K>(url: string, data: T, options?: Options): AxiosPromise<K> {
    return this.request.post(url, data, options);
  }

  public patch<T, K>(url: string, data: T, options: Options): AxiosPromise<K> {
    return this.request.patch(url, data, options);
  }

  public del<T>(url: string, data?: unknown, params?: object, options?: Options): AxiosPromise<T> {
    return this.request.delete(url, {
      url,
      data,
      params,
      ...options,
    });
  }

  public put<T, K>(url: string, data: T, params?: object, options?: Options): AxiosPromise<K> {
    return this.request.put(url, data, { params, ...options });
  }
}

export { HttpActions };
