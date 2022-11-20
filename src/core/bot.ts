import { Telegraf, Scenes, Context, MiddlewareFn } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import type { WizardContext } from 'telegraf/typings/scenes';

import { Controllers } from 'controllers';
import { BotScene, CommonHears } from 'controllers/constants';
import { Command, GracefulStopEvent } from 'core/constants';
import { RootController } from 'core/rootController';
import { errorHandler } from 'shared/helpers/errorHandler';
import { logger } from 'shared/helpers/logger';
import { BOT_TOKEN, WEBHOOK_PORT, WEBHOOK_URL } from 'shared/helpers/env';

const session = new LocalSession();

const { Stage } = Scenes;

class Bot {
  constructor(private bot: Telegraf) {
    this.rootController = new RootController();
    this.controllers = this.rootController.controllers;

    this.stage = new Stage(
      [
        this.controllers.main.scene,
        this.controllers.addPlace.scene,
        this.controllers.findPlace.scene,
        this.controllers.debug.scene,
      ],
      { default: BotScene.MAIN },
    );
  }

  private readonly rootController: RootController;
  private readonly controllers: Controllers;
  private readonly stage;

  init() {
    this.middlewares();
    this.actions();
    this.commands();
    this.hears();
    this.logger();
    this.launch();
    this.gracefulStop();
  }

  private middlewares() {
    // this.bot.use(i18n.middleware());
    this.bot.use(session.middleware());
    this.bot.use(this.stage.middleware() as MiddlewareFn<Context>);
  }

  private actions() {
    this.bot.start(
      errorHandler(async ctx => {
        return (ctx as never as WizardContext).scene.enter(BotScene.MAIN);
      }),
    );
  }

  private commands() {
    this.bot.command(
      Command.MENU,
      errorHandler(async ctx => {
        const context = ctx as never as WizardContext;
        await context.scene.leave();
        return context.scene.enter(BotScene.MAIN);
      }),
    );
  }

  private hears() {
    this.bot.hears(
      CommonHears.MAIN_MENU,
      errorHandler(async ctx => {
        const context = ctx as never as WizardContext;
        await context.scene.leave();
        return context.scene.enter(BotScene.MAIN);
      }),
    );
  }

  private launch() {
    // const config: Telegraf.LaunchOptions = IS_PRODUCTION ? this.prodConfig : {};

    this.bot
      .launch()
      .then(() => logger.console('Bot was launched...!'))
      .catch((err: Error) => logger.console(err));
  }

  private get prodWebHookConfig(): Telegraf.LaunchOptions {
    return {
      webhook: {
        domain: WEBHOOK_URL,
        port: WEBHOOK_PORT,
        hookPath: `/bot${BOT_TOKEN}`,
      },
    };
  }

  private logger() {
    this.bot.catch((err, ctx) => {
      logger.error(ctx, 'Global error has happened, %O', err);
    });
  }

  private gracefulStop() {
    process.once(GracefulStopEvent.SIGINT, () => this.bot.stop(GracefulStopEvent.SIGINT));
    process.once(GracefulStopEvent.SIGTERM, () => this.bot.stop(GracefulStopEvent.SIGTERM));
  }
}

export { Bot };
