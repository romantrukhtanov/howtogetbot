import { Markup, Scenes } from 'telegraf';

import { TELEGRAM_BOT_LINK } from 'shared/helpers/env';
import { Action } from 'components/Form/constants';
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
  }

  private readonly showStepsAction: string;

  public reply = () => {
    const { title, addressUrl, id } = this.form;

    return this.ctx.reply(
      `- 📜 ${title}\n\n- 📍${addressUrl}`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Show steps 📜', this.showStepsAction),
          Markup.button.switchToChat('Share with...🔗', `${TELEGRAM_BOT_LINK}?start=form_${id}`),
        ],
      ]),
    );
  };
}

export { Form };
