import { Markup, Scenes } from 'telegraf';

import { BotScene, CommonHears } from 'controllers/constants';
import { WizardComposer } from 'shared/components/wizardComposer';
import { errorHandler } from 'shared/helpers/errorHandler';
import type { Services } from 'services';
import type { Api } from 'core/api';

const { WizardScene } = Scenes;

class Debug {
  constructor(private readonly services: Services, private readonly api: Api) {
    this.scene = new WizardScene(BotScene.DEBUG_FILES, this.enter, this.handlers);
    this.hears();
  }

  public scene;

  private enter = async (ctx: Scenes.WizardContext) => {
    await ctx.reply(
      'Welcome to debug files mode!\nPlease send any file...',
      Markup.keyboard([CommonHears.MAIN_MENU]).oneTime().resize(),
    );
    return ctx.wizard.next();
  };

  private hears() {
    this.scene.hears(CommonHears.MAIN_MENU, errorHandler(this.leave));
  }

  private get handlers() {
    const stepHandler = new WizardComposer();

    stepHandler.on(
      'animation',
      errorHandler(async ctx => {
        const fileVideo = ctx.message.animation;

        await ctx.reply('animation');
        await ctx.reply(JSON.stringify(fileVideo, undefined, 2));
      }),
    );
    stepHandler.on(
      'video',
      errorHandler(async ctx => {
        const fileVideo = ctx.message.video;

        await ctx.reply('video');
        await ctx.reply(JSON.stringify(fileVideo, undefined, 2));
      }),
    );

    stepHandler.on(
      'photo',
      errorHandler(async ctx => {
        const fileIdPhoto = ctx.message.photo[ctx.message.photo.length - 1].file_id;

        const fileData = await ctx.telegram.getFile(fileIdPhoto);

        // const fileLink = await ctx.telegram.getFileLink(fileIdPhoto);
        // const fileBase64 = await this.services.download.getBase64(fileLink.href);
        //
        // const stepId = num;
        // const number = 5;
        //
        // await this.api.uploadFile(stepId, fileBase64);
        // await this.api.updateStepTgMedia({
        //   id: stepId,
        //   number,
        //   formId: 6,
        //   tgMediaType: TgMediaType.PHOTO,
        //   tgFileId: fileIdPhoto,
        // });

        await ctx.reply('photo success');
        await ctx.reply(JSON.stringify(fileData, undefined, 2));
      }),
    );

    stepHandler.use(ctx => ctx.replyWithMarkdown('Please send any file 🗃'));

    return stepHandler;
  }

  private async leave(ctx: Scenes.WizardContext) {
    return ctx.scene.enter(BotScene.MAIN);
  }
}

export { Debug };
