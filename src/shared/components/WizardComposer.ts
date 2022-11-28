import { Composer, Scenes } from 'telegraf';

import { Command } from 'core/constants';
import { errorHandler } from 'shared/helpers/errorHandler';
import { BotScene } from 'controllers/constants';

export class WizardComposer extends Composer<Scenes.WizardContext> {
  constructor() {
    super();
    this.baseCommands();
  }

  private baseCommands() {
    super.command(Command.MENU, errorHandler(this.enterToMain, 'WizardComposer (enterToMain)'));
    super.command(Command.START, errorHandler(this.enterToMain, 'WizardComposer (enterToMain)'));
    super.command(Command.FIND, errorHandler(this.enterToFind, 'WizardComposer (enterToFind)'));
    super.command(Command.ADD, errorHandler(this.enterToAdd, 'WizardComposer (enterToAdd)'));
  }

  private async enterToMain(ctx: Scenes.WizardContext) {
    return ctx.scene.enter(BotScene.MAIN);
  }

  private async enterToFind(ctx: Scenes.WizardContext) {
    return ctx.scene.enter(BotScene.FIND_PLACE);
  }

  private async enterToAdd(ctx: Scenes.WizardContext) {
    return ctx.scene.enter(BotScene.ADD_PLACE);
  }
}
