import { Scenes } from 'telegraf';

import { logger } from 'shared/helpers/logger';
import { createStep } from 'modules/createSteps/createStep';
import type { Api } from 'core/api';
import type * as M from 'core/api/model';

export const createSteps = (
  steps: M.Step[],
  ctx: Scenes.WizardContext,
  scene: Scenes.WizardScene<Scenes.WizardContext>,
  api: Api,
) => {
  return { reply };

  async function reply() {
    try {
      if (!steps) return;

      return await steps.reduce(async (promise, step) => {
        await promise;
        await replyStep(step);
      }, Promise.resolve());
    } catch (err) {
      logger.error(ctx, 'replySteps error: %O', err);
      await ctx.reply('Something went wrong...😢\nPlease try again...🔁');
    }
  }

  function replyStep(step: M.Step) {
    const createdStep = createStep(step, ctx, scene, api);
    return createdStep.reply();
  }
};
