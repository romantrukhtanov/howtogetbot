import { Markup, Scenes } from 'telegraf';

import { shareForm } from 'shared/actions';
import { errorHandler } from 'shared/helpers/errorHandler';
import { WizardComposer } from 'shared/components/WizardComposer';
import { logger } from 'shared/helpers/logger';
import { BotScene, CommonHears } from 'controllers/constants';
import { Form } from 'components/Form';
import { Action } from 'components/Form/constants';
import { Steps } from 'components/Steps';
import type * as M from 'core/api/model';
import type { Api } from 'core/api';
import type { Services } from 'services';

const { WizardScene } = Scenes;

class FindPlace {
  constructor(private readonly services: Services, private readonly api: Api) {
    this.scene = new WizardScene(
      BotScene.FIND_PLACE,
      errorHandler(this.enter, 'FindPlace (enter)'),
      this.handleForms,
    );

    this.forms = [];
    this.hears();
    this.actions();
  }

  public scene: Scenes.WizardScene<Scenes.WizardContext>;
  private forms: M.Form[];

  private enter = async (ctx: Scenes.WizardContext) => {
    await ctx.reply(
      '📍Send address of the place:',
      Markup.keyboard([CommonHears.MAIN_MENU]).oneTime().resize(),
    );
    return ctx.wizard.next();
  };

  private hears() {
    this.scene.hears(CommonHears.MAIN_MENU, errorHandler(this.leave));
  }

  private get handleForms() {
    const stepHandler = new WizardComposer();

    stepHandler.on(
      'text',
      errorHandler(async ctx => {
        const message = ctx.message.text;
        const forms = await this.api.findPlace(message);

        if (!forms) {
          await ctx.reply("Couldn't find any places🥲\nPlease try to send another address...📝");
          return;
        }

        this.setForms(forms);
        await this.showForms(ctx);
      }, 'FindPlace (handleForms method)'),
    );

    stepHandler.use(
      errorHandler(ctx =>
        ctx.replyWithMarkdown('Please send place address or back to main menu... 📝'),
      ),
    );

    return stepHandler;
  }

  private setForms = (forms: M.Form[]) => {
    this.forms = forms;
  };

  private showForms = async (ctx: Scenes.WizardContext) => {
    if (!this.forms) return Promise.reject();

    await this.forms.reduce(async (promise, form) => {
      try {
        await promise;
        await this.replyForm(form, ctx);
      } catch (err) {
        logger.error(ctx, 'ShowForms async reduce error: %O', err);
        await ctx.reply('Something went wrong...😢\nPlease try again...🔁');
      }
    }, Promise.resolve());

    // await ctx.reply('You can find other place 🙃\nJust send the name of the place...');
  };

  private replyForm = (form: M.Form, ctx: Scenes.WizardContext) => {
    const formItem = new Form(form, ctx, this.scene, this.api, this.services);
    return formItem.reply();
  };

  private actions() {
    this.scene.action(
      new RegExp(`${Action.SHOW_STEPS}_(.+)`),
      errorHandler(async ctx => {
        await ctx.answerCbQuery();
        if (!this.forms.length) return;

        const formId = Number(ctx.match[1]);
        const form = this.forms.find(item => item.id === formId);
        if (!form) return;

        const message = await ctx.reply('Connecting...🔗');
        const steps = new Steps(form.steps, ctx, this.api);
        await steps.reply();
        await ctx.deleteMessage(message.message_id);
      }, 'Show Steps action'),
    );

    this.scene.action(
      new RegExp(`${Action.SHARE_FORM}_(.+)`),
      errorHandler(async ctx => {
        await ctx.answerCbQuery();
        if (!this.forms.length) return;

        const formId = Number(ctx.match[1]);
        const form = this.forms.find(item => item.id === formId);
        if (!form) return;

        await shareForm(ctx, form);
      }, 'Share form action'),
    );

    this.scene.action(
      new RegExp(`${Action.DELETE_STEP}_(.+)`),
      errorHandler(async ctx => {
        await ctx.deleteMessage();
        await ctx.answerCbQuery();
      }, 'Delete Step action'),
    );
  }

  private async leave<T extends Scenes.WizardContext>(ctx: T) {
    return ctx.scene.enter(BotScene.MAIN);
  }
}

export { FindPlace };
