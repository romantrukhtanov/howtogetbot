import { IS_DEV } from 'shared/helpers/env';

type Env = 'prod' | 'dev';

type ApiName = 'api';

const API_URLS_BY_ENV: Record<Env, Record<ApiName, string>> = {
  dev: {
    api: 'https://howtoget.herokuapp.com',
  },
  prod: {
    api: 'https://howtoget.herokuapp.com',
  },
};

export const API_URLS = API_URLS_BY_ENV[IS_DEV ? 'dev' : 'prod'];
