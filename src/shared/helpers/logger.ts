import util from 'util';
import winston, { format, Logger } from 'winston';
import type { Context } from 'telegraf';
import type { TransformableInfo } from 'logform';

import { IS_PRODUCTION } from './env';

type Data<T> = T[];

function prepareMessage<C extends Context, T>(ctx: C, msg: string, ...data: Data<T>) {
  const formattedMessage = data.length ? util.format(msg, ...data) : msg;

  const id = ctx.from?.id;
  const username = ctx.from?.username;

  if (id && username) {
    return `[${id}/${username}]: ${formattedMessage}`;
  }

  return formattedMessage;
}

const { combine, timestamp, printf } = format;

type Info = {
  timestamp?: number;
} & TransformableInfo;

const logFormat = printf((info: Info) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return `[${info.timestamp}] [${info.level}]${info.message}`;
});

const loggerInstance: Logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: IS_PRODUCTION ? 'error' : 'debug',
    }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
  format: combine(timestamp(), format.splat(), format.simple(), logFormat),
});

if (IS_PRODUCTION) {
  loggerInstance.debug('Logging initialized at debug level');
}

const logger = {
  debug: <C extends Context, T>(ctx: C, msg: string, ...data: Data<T>): Logger =>
    loggerInstance.debug(prepareMessage(ctx, msg, ...data)) as Logger,
  error: <C extends Context, T>(ctx: C, msg: string, ...data: Data<T>): Logger =>
    loggerInstance.error(prepareMessage(ctx, msg, ...data)) as Logger,
  // eslint-disable-next-line no-console
  console: (msg: string | Error) => (msg instanceof Error ? console.error(msg) : console.log(msg)),
};

export { logger };
