import { Markup, Scenes } from 'telegraf';

import { hasTgStepMedia } from 'controllers/findPlace/helpers';
import { replyTgMediaStep, replyURLStep } from 'controllers/findPlace/actions';
import { TgMediaType } from 'core/constants';
import { Action } from 'components/Form/constants';
import type { Api } from 'core/api';
import type * as M from 'core/api/model';

class Step {
  constructor(private step: M.Step, private ctx: Scenes.WizardContext, private api: Api) {}

  private readonly deleteAction = `${Action.DELETE_STEP}_${this.step.id}`;

  public reply = () => {
    if (!this.step) return;
    return this.renderStep();
  };

  private renderStep = () => {
    if (!hasTgStepMedia(this.step) && this.step.fileAttachmentId) {
      return this.renderUrlStep(this.step);
    }

    return replyTgMediaStep(this.step, this.ctx, this.deleteButton);
  };

  private renderUrlStep = async (step: M.Step) => {
    const message = await this.ctx.reply('Downloading...⌛️');
    const fileUrl = this.api.getFileLink(step.fileAttachmentId);

    const responseMessage = await replyURLStep(step, fileUrl, this.ctx, this.deleteButton);

    if ('photo' in responseMessage) {
      const fileIdPhoto = responseMessage.photo[responseMessage.photo.length - 1].file_id;

      await this.api.updateStepTgMedia({
        ...step,
        tgFileId: fileIdPhoto,
        tgMediaType: TgMediaType.PHOTO,
      });
    }

    await this.ctx.deleteMessage(message.message_id);
    await this.ctx.answerCbQuery();
  };

  private get deleteButton() {
    return Markup.inlineKeyboard([Markup.button.callback('🗑 delete message', this.deleteAction)]);
  }
}

export { Step };
