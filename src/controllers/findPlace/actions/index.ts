import { Context } from 'telegraf';
import type { ExtraEditMessageMedia } from 'telegraf/typings/telegram-types';

import { convertTgMedia } from 'controllers/findPlace/converter';
import { hasTgStepMedia } from 'controllers/findPlace/helpers';
import { TgMediaType } from 'core/constants';
import type * as M from 'core/api/model';

export const editTgMediaStep = async <C extends Context>(
  step: M.Step,
  ctx: C,
  keyboard?: ExtraEditMessageMedia,
) => {
  const media = convertTgMedia(step);
  if (!media) return Promise.reject();

  return ctx.editMessageMedia(media, keyboard);
};

export const replyURLStep = async <TContext extends Context, TExtra>(
  step: M.Step,
  source: Buffer,
  ctx: TContext,
  extra?: TExtra,
) => {
  switch (step.tgMediaType) {
    case TgMediaType.PHOTO:
      return ctx.replyWithPhoto(
        {
          source,
        },
        {
          caption: step.description,
          ...extra,
        },
      );
    case TgMediaType.VIDEO:
      return ctx.replyWithVideo(
        {
          source,
        },
        {
          caption: step.description,
          ...extra,
        },
      );
    default:
      return ctx.reply(step.description, {
        ...extra,
      });
  }
};

export const replyTgMediaStep = async <TContext extends Context, TExtra>(
  step: M.Step,
  ctx: TContext,
  extra?: TExtra,
) => {
  if (!hasTgStepMedia(step)) return Promise.reject();

  switch (step.tgMediaType) {
    case TgMediaType.PHOTO:
      return ctx.replyWithPhoto(step.tgFileId as string, {
        caption: step.description,
        ...extra,
      });
    case TgMediaType.VIDEO:
      return ctx.replyWithVideo(step.tgFileId as string, {
        caption: step.description,
        ...extra,
      });
    default:
      return ctx.reply(step.description, {
        ...extra,
      });
  }
};

export const replySourceStep = async <TContext extends Context, S extends Buffer, TExtra>(
  step: M.Step,
  source: S,
  ctx: TContext,
  extra?: TExtra,
) => {
  switch (step.tgMediaType) {
    case TgMediaType.PHOTO:
      return ctx.replyWithPhoto(
        {
          source,
        },
        {
          caption: step.description,
          ...extra,
        },
      );
    case TgMediaType.VIDEO:
      return ctx.replyWithVideo(
        {
          source,
        },
        {
          caption: step.description,
          ...extra,
        },
      );
    default:
      return ctx.reply(step.description, {
        ...extra,
      });
  }
};
