import { Markup, Scenes } from 'telegraf';

import { TELEGRAM_BOT_LINK } from 'shared/helpers/env';
import { Action } from 'components/Form/constants';
import type { Api } from 'core/api';
import type { Services } from 'services';
import type * as M from 'core/api/model';

class Form {
  constructor(
    private form: M.Form,
    private ctx: Scenes.WizardContext,
    private scene: Scenes.WizardScene<Scenes.WizardContext>,
    private api: Api,
    private services: Services,
  ) {
    this.showStepsAction = `${Action.SHOW_STEPS}_${this.form.id}`;
  }

  private readonly showStepsAction: string;

  public reply = () => {
    const { title, address, id } = this.form;

    const { latitude, longitude, shortUrl, fullAddress } = address;

    const placeMapsViewUrl = this.services.mapsApi.getPlaceUrl({ longitude, latitude });

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('Show steps 📜', this.showStepsAction),
        Markup.button.switchToChat('Share with...🔗', `${TELEGRAM_BOT_LINK}?start=form_${id}`),
      ],
    ]);

    return this.ctx.replyWithPhoto(
      {
        url: placeMapsViewUrl,
      },
      {
        caption: `📜 ${title}\n\n🌏 ${fullAddress}\n\n📍${shortUrl}`,
        reply_markup: keyboard.reply_markup,
      },
    );
  };
}

export { Form };
