import * as M from 'core/api/model';
import { TgMediaType } from 'core/constants';
import { exhaustiveCheck } from 'shared/helpers/exhaustiveCheck';

export function convertTgMedia(step: M.Step) {
  if (!step.tgMediaType || !step.tgFileId) return;

  switch (step.tgMediaType) {
    case TgMediaType.PHOTO:
      return {
        type: TgMediaType.PHOTO,
        media: step.tgFileId,
        caption: step.description,
      };
    case TgMediaType.VIDEO:
      return {
        type: TgMediaType.VIDEO,
        media: step.tgFileId,
        caption: step.description,
      };
    default:
      exhaustiveCheck(step.tgMediaType);
  }
}
