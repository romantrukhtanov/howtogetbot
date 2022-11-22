import { Markup, Scenes } from 'telegraf';
import path from 'path';

import { BotScene, CommonHears } from 'controllers/constants';
import { errorHandler } from 'shared/helpers/errorHandler';
import * as AppUrl from 'shared/helpers/appsUrls';
import type { Services } from 'services';
import type { Api } from 'core/api';

const { WizardScene } = Scenes;

class AddPlace {
  constructor(private readonly services: Services, private readonly api: Api) {
    this.scene = new WizardScene(BotScene.ADD_PLACE, errorHandler(this.enter), this.leave);

    this.hears();
  }

  public scene: Scenes.WizardScene<Scenes.WizardContext>;

  private get appsButtons() {
    const buttons = [
      Markup.button.url('🤖 Android', AppUrl.ANDROID_APP_URL),
      Markup.button.url('📱 iOS', AppUrl.IOS_APP_URL),
      Markup.button.url('🕸️ Web', AppUrl.WEB_APP_URL),
    ];

    return Markup.inlineKeyboard(buttons);
  }

  private enter = async (ctx: Scenes.WizardContext) => {
    await ctx.replyWithPhoto(
      {
        source: path.resolve('src/assets/images/how-to-get-logo.jpg'),
      },
      Markup.keyboard([CommonHears.MAIN_MENU]).oneTime().resize(),
    );

    await ctx.reply('🙃 You can add the place in our apps:', {
      reply_markup: {
        inline_keyboard: this.appsButtons.reply_markup.inline_keyboard,
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
    return ctx.wizard.next();
  };

  private hears() {
    this.scene.hears(CommonHears.MAIN_MENU, errorHandler(this.leave));
  }

  private async leave<T extends Scenes.WizardContext>(ctx: T) {
    return ctx.scene.enter(BotScene.MAIN);
  }
}

export { AddPlace };
