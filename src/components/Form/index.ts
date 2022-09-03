import { Markup, Scenes } from 'telegraf';

import { errorHandler } from 'shared/helpers/errorHandler';
import { TELEGRAM_BOT_LINK } from 'shared/helpers/env';
import { Action } from 'components/Form/constants';
import { Steps } from 'components/Steps';
import type { Api } from 'core/api';
import type * as M from 'core/api/model';

class Form {
  constructor(
    private form: M.Form,
    private ctx: Scenes.WizardContext,
    private scene: Scenes.WizardScene<Scenes.WizardContext>,
    private api: Api,
  ) {
    this.showStepsAction = `${Action.SHOW_STEPS}_${this.form.id}`;
    this.actions();
  }

  private readonly showStepsAction: string;

  public reply = () => {
    const { title, fullAddress, id } = this.form;

    return this.ctx.reply(
      `- 📜 ${title}\n\n- 📍${fullAddress}`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Show form 📜', this.showStepsAction),
          Markup.button.switchToChat('Share form 🔗', `${TELEGRAM_BOT_LINK}?start=form_${id}`),
        ],
      ]),
    );
  };

  private actions() {
    this.scene.action(
      this.showStepsAction,
      errorHandler(async ctx => {
        const message = await ctx.reply('Connecting...🔗');

        const steps = new Steps(this.form.steps, ctx, this.scene, this.api);

        await steps.reply();

        await ctx.deleteMessage(message.message_id);
      }),
    );
  }
}

export { Form };
