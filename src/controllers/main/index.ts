import { Markup, Scenes } from 'telegraf';
import type { Message } from 'typegram';

import { Form } from 'components/Form';
import { Steps } from 'components/Steps';
import { Action as FormAction } from 'components/Form/constants';
import { Action, Command } from 'core/constants';
import { BotScene } from 'controllers/constants';
import { logger } from 'shared/helpers/logger';
import { getShareFormMessage } from 'shared/messages';
import { errorHandler } from 'shared/helpers/errorHandler';
import type { Services } from 'services';
import type { Api } from 'core/api';
import type * as M from 'core/api/model';

const { WizardScene } = Scenes;

class Main {
  constructor(private readonly services: Services, private readonly api: Api) {
    this.scene = new WizardScene(BotScene.MAIN, errorHandler(this.enter));
    this.actions();
    this.formActions();
    this.commands();
  }

  public scene;
  private form?: M.Form;

  private get standaloneKeyboard() {
    const buttons = [
      Markup.button.callback('📍Add place', Action.ADD_PLACE),
      Markup.button.callback('🔍 Find place', Action.FIND_PLACE),
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
    const token = text.match(/f_?(.*)/)?.[1];

    if (!token) return;

    return this.replyForm(token, ctx);
  }

  private replyForm = async (token: string, ctx: Scenes.WizardContext) => {
    try {
      const message = await ctx.reply('Connecting...🔗');

      const form = await this.api.getPlace(token);

      if (!form) {
        await ctx.deleteMessage(message.message_id);
        return;
      }

      this.form = form;
      const createdForm = new Form(form, ctx, this.scene, this.api, this.services);
      await createdForm.reply();
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

  private formActions() {
    this.scene.action(
      new RegExp(`${FormAction.SHOW_STEPS}_(.+)`),
      errorHandler(async ctx => {
        await ctx.answerCbQuery();
        if (!this.form) return;

        const message = await ctx.reply('Connecting...🔗');
        const steps = new Steps(this.form.steps, ctx, this.api);
        await steps.reply();
        await ctx.deleteMessage(message.message_id);
      }, 'Show Steps action (main scene)'),
    );

    this.scene.action(
      new RegExp(`${FormAction.SHARE_FORM}_(.+)`),
      errorHandler(async ctx => {
        await ctx.answerCbQuery();
        if (!this.form) return;

        await ctx.reply(getShareFormMessage(this.form));
      }, 'Share form action (main scene)'),
    );

    this.scene.action(
      new RegExp(`${FormAction.DELETE_STEP}_(.+)`),
      errorHandler(async ctx => {
        await ctx.deleteMessage();
        await ctx.answerCbQuery();
      }, 'Delete Step action (main scene)'),
    );
  }

  private commands() {
    this.scene.command(
      Command.DEBUG,
      errorHandler(async (ctx: Scenes.WizardContext) => {
        await ctx.scene.enter(BotScene.DEBUG_FILES);
      }),
    );
    this.scene.command(
      Command.FIND,
      errorHandler(async (ctx: Scenes.WizardContext) => {
        await ctx.scene.enter(BotScene.FIND_PLACE);
      }),
    );
    this.scene.command(
      Command.ADD,
      errorHandler(async (ctx: Scenes.WizardContext) => {
        await ctx.scene.enter(BotScene.ADD_PLACE);
      }),
    );
  }
}

export { Main };
