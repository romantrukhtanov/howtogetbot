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
    super.command(Command.MENU, errorHandler(this.leave, 'WizardComposer (leave)'));
    super.command(Command.START, errorHandler(this.leave, 'WizardComposer (leave)'));
  }

  private async leave(ctx: Scenes.WizardContext) {
    return ctx.scene.enter(BotScene.MAIN);
  }
}
