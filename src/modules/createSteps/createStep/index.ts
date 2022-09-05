import { Markup, Scenes } from 'telegraf';

import { hasTgStepMedia } from 'controllers/findPlace/helpers';
import { replyTgMediaStep, replyURLStep } from 'controllers/findPlace/actions';
import { TgMediaType } from 'core/constants';
import { Action } from 'modules/createForm/constants';
import type { Api } from 'core/api';
import type * as M from 'core/api/model';

export const createStep = (
  step: M.Step,
  ctx: Scenes.WizardContext,
  scene: Scenes.WizardScene<Scenes.WizardContext>,
  api: Api,
) => {
  const deleteAction = `${Action.DELETE_STEP}_${step.id}`;
  const deleteButton = Markup.inlineKeyboard([
    Markup.button.callback('🗑 delete message', deleteAction),
  ]);

  actions();

  return { reply };

  function reply() {
    if (!step) return;
    return renderStep();
  }

  function renderStep() {
    if (!hasTgStepMedia(step) && step.fileAttachmentId) {
      return renderUrlStep();
    }

    return replyTgMediaStep(step, ctx, deleteButton);
  }

  async function renderUrlStep() {
    const message = await ctx.reply('Downloading...⌛️');
    const fileUrl = api.getFileLink(step.fileAttachmentId);

    const responseMessage = await replyURLStep(step, fileUrl, ctx, deleteButton);

    if ('photo' in responseMessage) {
      const fileIdPhoto = responseMessage.photo[responseMessage.photo.length - 1].file_id;

      await api.updateStepTgMedia({
        ...step,
        tgFileId: fileIdPhoto,
        tgMediaType: TgMediaType.PHOTO,
      });
    }

    await ctx.deleteMessage(message.message_id);
  }

  function actions() {
    scene.action(deleteAction, async actionCtx => {
      await actionCtx.deleteMessage();
      await actionCtx.answerCbQuery();
    });
  }
};
