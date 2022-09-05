import { Markup, Scenes } from 'telegraf';

import { errorHandler } from 'shared/helpers/errorHandler';
import { WizardComposer } from 'shared/components/WizardComposer';
import { logger } from 'shared/helpers/logger';
import { BotScene, CommonHears } from 'controllers/constants';
import { createForm } from 'modules/createForm';
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

    this.hears();
  }

  public scene: Scenes.WizardScene<Scenes.WizardContext>;

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

        await this.showForms(forms, ctx);
      }, 'FindPlace (handleForms method)'),
    );

    stepHandler.use(
      errorHandler(ctx =>
        ctx.replyWithMarkdown('Please send place address or back to main menu... 📝'),
      ),
    );

    return stepHandler;
  }

  private showForms = async (forms: M.Form[], ctx: Scenes.WizardContext) => {
    if (!forms) return Promise.reject();

    await forms.reduce(async (promise, form) => {
      try {
        await promise;
        await this.replyForm(form, ctx);
      } catch (err) {
        logger.error(ctx, 'ShowForms async reduce error: %O', err);
        await ctx.reply('Something went wrong...😢\nPlease try again...🔁');
      }
    }, Promise.resolve());
  };

  private replyForm = (form: M.Form, ctx: Scenes.WizardContext) => {
    const createdForm = createForm(form, ctx, this.scene, this.api);
    return createdForm.reply();
  };

  private async leave<T extends Scenes.WizardContext>(ctx: T) {
    return ctx.scene.enter(BotScene.MAIN);
  }
}

export { FindPlace };
