import { Markup, Scenes } from 'telegraf';

import { errorHandler } from 'shared/helpers/errorHandler';
import { TELEGRAM_BOT_LINK } from 'shared/helpers/env';
import { Action } from 'modules/createForm/constants';
import { createSteps } from 'modules/createSteps';
import type { Api } from 'core/api';
import type * as M from 'core/api/model';

export const createForm = (
  form: M.Form,
  ctx: Scenes.WizardContext,
  scene: Scenes.WizardScene<Scenes.WizardContext>,
  api: Api,
) => {
  const showStepsAction = `${Action.SHOW_STEPS}_${form.id}`;
  actions();

  return { reply };

  function reply() {
    const { title, addressUrl, id } = form;

    return ctx.reply(
      `- 📜 ${title}\n\n- 📍${addressUrl}`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Show form 📜', showStepsAction),
          Markup.button.switchToChat('Share form 🔗', `${TELEGRAM_BOT_LINK}?start=form_${id}`),
        ],
      ]),
    );
  }

  function actions() {
    scene.action(
      showStepsAction,
      errorHandler(async actionCtx => {
        const message = await actionCtx.reply('Connecting...🔗');

        const steps = createSteps(form.steps, actionCtx, scene, api);
        await steps.reply();

        await actionCtx.deleteMessage(message.message_id);
        await actionCtx.answerCbQuery();
      }),
    );
  }
};
