import { Telegraf } from 'telegraf';
import type { InlineQueryResult } from 'typegram';

import { errorHandler } from 'shared/helpers/errorHandler';
import type { RootController } from 'core/rootController';

// TODO: implement inline mode
class InlineBot {
  constructor(private bot: Telegraf, private readonly rootController: RootController) {}

  init() {
    this.handlers();
  }

  private handlers() {
    this.bot.on(
      'inline_query',
      errorHandler(async ctx => {
        // const { query } = ctx.inlineQuery;
        // const forms = await api.findPlace(query);

        const results: InlineQueryResult[] = [
          {
            id: `${Math.random() * 10}`,
            type: 'article',
            title: 'Villa Suka',
            thumb_url: 'https://picsum.photos/200',
            thumb_width: 200,
            thumb_height: 200,
            description: 'Gang Wayang No.13, Kerobokan, Kuta Utara, Badung Regency, Bali 80361',
            input_message_content: {
              message_text: 'Villa Suka',
            },
          },
        ];

        await ctx.answerInlineQuery(results, {
          switch_pm_text: 'HowToGet_Bot',
          switch_pm_parameter: 'Hello',
        });
      }),
    );
  }
}

export { InlineBot };
