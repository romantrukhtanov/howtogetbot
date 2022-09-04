import { Markup, Scenes } from 'telegraf';
import type { Message } from 'typegram';

import { Form } from 'components/Form';
import { Action, Command } from 'core/constants';
import { BotScene } from 'controllers/constants';
import { IS_PRODUCTION } from 'shared/helpers/env';
import { errorHandler } from 'shared/helpers/errorHandler';
import type { Services } from 'services';
import type { Api } from 'core/api';

import { logger } from '../../shared/helpers/logger';

const { WizardScene } = Scenes;

class Main {
  constructor(private readonly services: Services, private readonly api: Api) {
    this.scene = new WizardScene(BotScene.MAIN, errorHandler(this.enter));
    this.actions();
    this.commands();
  }

  public scene;

  private get standaloneKeyboard() {
    const buttons = [
      Markup.button.callback('🔍 Find place', Action.FIND_PLACE),
      Markup.button.callback('📍Add place (Soon)', Action.ADD_PLACE),
    ];

    return Markup.inlineKeyboard(buttons);
  }

  private enter = async (ctx: Scenes.WizardContext) => {
    const formMessage = this.matchFormMessage(ctx);
    if (formMessage) return;

    await ctx.reply('Hey amigo!😎', Markup.removeKeyboard());
    await ctx.reply('Choose an action:', this.standaloneKeyboard);
  };

  private matchFormMessage(ctx: Scenes.WizardContext) {
    if (!ctx.message) return;

    const text = (ctx.message as Message.TextMessage)?.text;
    const formId = text.match(/form_(.*)/)?.[1];

    if (formId) {
      return this.replyForm(Number(formId), ctx);
    }
  }

  private replyForm = async (formId: number, ctx: Scenes.WizardContext) => {
    try {
      const message = await ctx.reply('Connecting...🔗');

      const form = await this.api.getPlace(formId);

      if (!form) {
        await ctx.deleteMessage(message.message_id);
        return;
      }

      const formItem = new Form(form, ctx, this.scene, this.api);
      await formItem.reply();
      await ctx.deleteMessage(message.message_id);
    } catch (error) {
      logger.error(ctx, 'replyForm by start error: %O', error);
      await ctx.reply('Something went wrong...😢\nPlease try again...🔁');
    }
  };

  private actions() {
    this.scene.action(
      Action.ADD_PLACE,
      errorHandler(async (ctx: Scenes.WizardContext) => {
        if (IS_PRODUCTION) {
          await ctx.answerCbQuery();
          await ctx.reply('In progress...🙃');
        }

        return ctx.scene.enter(BotScene.ADD_PLACE);
      }),
    );

    this.scene.action(
      Action.FIND_PLACE,
      errorHandler(async (ctx: Scenes.WizardContext) => {
        await ctx.answerCbQuery();
        return ctx.scene.enter(BotScene.FIND_PLACE);
      }),
    );
  }

  private commands() {
    this.scene.command(
      Command.DEBUG,
      errorHandler(async (ctx: Scenes.WizardContext) => {
        await ctx.scene.enter(BotScene.DEBUG_FILES);
      }),
    );
  }
}

export { Main };
