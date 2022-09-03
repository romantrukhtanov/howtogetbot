import { Scenes } from 'telegraf';

import { logger } from 'shared/helpers/logger';
import { Step } from 'components/Steps/Step';
import type { Api } from 'core/api';
import type * as M from 'core/api/model';

class Steps {
  constructor(
    private steps: M.Step[],
    private ctx: Scenes.WizardContext,
    private scene: Scenes.WizardScene<Scenes.WizardContext>,
    private api: Api,
  ) {}

  public reply = async () => {
    try {
      if (!this.steps) return;

      await this.steps.reduce(async (promise, step) => {
        await promise;
        await this.replyStep(step);
      }, Promise.resolve());

      await this.ctx.answerCbQuery();
    } catch (err) {
      logger.error(this.ctx, 'replySteps error: %O', err);
      await this.ctx.reply('Something went wrong...😢\nPlease try again...🔁');
    }
  };

  private replyStep = (step: M.Step) => {
    const stepItem = new Step(step, this.ctx, this.scene, this.api);
    return stepItem.reply();
  };
}

export { Steps };
