import { config } from 'dotenv';

export const envPath = '.env';
export const envConfig = config({ path: envPath });
