import { Scenes } from 'telegraf';

import { logger } from 'shared/helpers/logger';
import { Step } from 'components/Steps/Step';
import { TgMediaType } from 'core/constants';
import type { Api } from 'core/api';
import type * as M from 'core/api/model';

class Steps {
  constructor(private steps: M.Step[], private ctx: Scenes.WizardContext, private api: Api) {}

  public reply = async () => {
    try {
      if (!this.steps) return;

      await this.steps.reduce(async (promise, step) => {
        await promise;
        await this.replyStep(step);
      }, Promise.resolve());
    } catch (err) {
      logger.error(this.ctx, 'replySteps error: %O', err);
      await this.ctx.reply('Something went wrong...😢\nPlease try again...🔁');
    }
  };

  private replyStep = (step: M.Step) => {
    const stepItem = new Step(step, this.ctx, this.api);
    return stepItem.reply();
  };

  // TODO: if we approve replying as a group
  public replyStepsGroup = async () => {
    const stepsMedia = this.steps.map(step => {
      if (step.tgMediaType && step.tgFileId) {
        return {
          type: step.tgMediaType,
          media: step.tgFileId,
        };
      }

      return {
        type: step.tgMediaType as TgMediaType,
        media: this.api.getFileLink(step.fileAttachmentId),
      };
    });

    await this.ctx.replyWithMediaGroup(stepsMedia);

    const stepsDescription = this.steps.map(step => step.description).join('\n');

    await this.ctx.reply(stepsDescription);
  };
}

export { Steps };
