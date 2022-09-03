import { Context } from 'telegraf';

import { logger } from './logger';

type Func<C extends Context, F> = (ctx: C) => Promise<F>;

const errorHandler = <C extends Context, F>(fn: Func<C, F>, handlerName?: string) => {
  return async (ctx: C, next: () => void) => {
    try {
      return await fn(ctx);
    } catch (error) {
      logger.error(ctx, `${handlerName ?? 'errorHandler'} error: %O`, error);
      await ctx.reply('Something went wrong...😢\nPlease try again...🔁');
      return next();
    }
  };
};

export { errorHandler };
