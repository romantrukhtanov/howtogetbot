import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

import { logger } from 'shared/helpers/logger';
import { base64buffer } from 'shared/helpers/base64converters';

export type Options = AxiosRequestConfig;

class Download {
  constructor() {
    const config: AxiosRequestConfig<never> = {
      responseType: 'arraybuffer',
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
            logger.console(response.data.error as string);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private readonly request: AxiosInstance;

  public file<T>(url: string, params?: object, options?: Options): AxiosPromise<T> {
    const config = { params, options };
    return this.request.get(url, config);
  }

  public async getBase64(url: string, params?: object, options?: Options): Promise<string> {
    const config = { params, options };
    const { data } = await this.request.get<string>(url, config);

    return base64buffer(data);
  }
}

export { Download };
