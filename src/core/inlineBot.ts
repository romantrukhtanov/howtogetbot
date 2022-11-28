import { Telegraf } from 'telegraf';
import type { InlineQueryResult } from 'typegram';

import { errorHandler } from 'shared/helpers/errorHandler';
import type { RootController } from 'core/rootController';
import type * as M from 'core/api/model';

import { getShareFormMessage } from '../shared/messages';

class InlineBot {
  constructor(private bot: Telegraf, private readonly rootController: RootController) {}

  init() {
    this.handlers();
  }

  private handlers() {
    this.bot.on(
      'inline_query',
      errorHandler(async ctx => {
        const { query } = ctx.inlineQuery;
        console.log(query);
        const forms = await this.rootController.api.findPlaces(query.trim());

        if (!forms) {
          return;
        }

        await ctx.answerInlineQuery(forms.map(this.convertForm), {
          switch_pm_text: 'HowToGet_Bot',
          switch_pm_parameter: 'Hello',
        });
      }),
    );
  }

  private convertForm(form: M.Form): InlineQueryResult {
    return {
      id: form.id.toString(),
      type: 'article',
      title: form.title,
      thumb_url: undefined, // TODO: add form image
      thumb_width: 200,
      thumb_height: 200,
      description: form.address.fullAddress,
      input_message_content: {
        message_text: getShareFormMessage(form),
      },
    };
  }
}

export { InlineBot };
