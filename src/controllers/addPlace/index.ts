import { Composer, Scenes } from 'telegraf';

import { Command } from 'core/constants';
import { BotScene } from 'controllers/constants';
import { errorHandler } from 'shared/helpers/errorHandler';
import { logger } from 'shared/helpers/logger';
import type { Services } from 'services';
import type { Api } from 'core/api';

const { WizardScene } = Scenes;

class AddPlace {
  constructor(private readonly services: Services, private readonly api: Api) {
    this.scene = new WizardScene(BotScene.ADD_PLACE, this.enter, this.media, this.leave);
  }

  public scene: Scenes.WizardScene<Scenes.WizardContext>;

  private async enter(ctx: Scenes.WizardContext) {
    await ctx.reply('Send photo or video of the place');
    return ctx.wizard.next();
  }

  private get media() {
    const stepHandler = new Composer<Scenes.WizardContext>();

    stepHandler.on(
      'animation',
      errorHandler(async ctx => {
        const fileAnimation = ctx.message.animation;
        logger.console(JSON.stringify({ fileAnimation }, undefined, 2));

        await ctx.reply(JSON.stringify(ctx.message.animation, undefined, 2));

        // const fileData = await ctx.telegram.getFileLink(fileIdPhoto);
      }),
    );
    stepHandler.on(
      'video',
      errorHandler(async ctx => {
        const fileVideo = ctx.message.video;
        logger.console(JSON.stringify({ fileVideo }, undefined, 2));

        await ctx.reply('video');
        await ctx.reply(JSON.stringify(ctx.message));

        // const fileData = await ctx.telegram.getFileLink(fileIdPhoto);
      }),
    );

    stepHandler.on(
      'photo',
      errorHandler(async ctx => {
        const fileIdPhoto = ctx.message.photo[ctx.message.photo.length - 1].file_id;

        const fileData = await ctx.telegram.getFileLink(fileIdPhoto);
        logger.console(JSON.stringify({ fileIdPhoto, fileData }, undefined, 2));

        // const extName = getExtName(fileData.pathname);
        // const { data } = await this.services.download.file<ArrayBuffer>(fileData.href);
        // await this.services.aws.putObject(data, extName);
        // return this.leave(ctx);
      }),
    );

    stepHandler.command(Command.MENU, this.leave);

    stepHandler.use(ctx => ctx.replyWithMarkdown('Please send photo or portrait video...📸'));

    return stepHandler;
  }

  private leave(ctx: Scenes.WizardContext) {
    return ctx.scene.enter(BotScene.MAIN);
  }
}

export { AddPlace };
