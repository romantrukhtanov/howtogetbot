import { red, green } from 'chalk';

import { envPath, envConfig } from './envConfig';

const requiredEnvVars = ['BOT_TOKEN_PROD', 'BOT_TOKEN_DEV'];
const { parsed } = envConfig;

if (!parsed) {
  // eslint-disable-next-line no-console
  console.log(red(`Environment variables validation failed. Unable to find env file: ${envPath}`));
  process.exit(1);
}

// Get missing environment variables
const missing = requiredEnvVars.filter(v => !(v in parsed));

// In case, we have missing variables, exit from process with non-zero code
if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.log(red(`Environment variables validation failed. Missing: ${missing.join(', ')}`));
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log(green('Envrionment variables are fine! Variables: '), parsed);
process.exit(0);
