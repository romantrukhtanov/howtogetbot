import { Context } from 'telegraf';

import { convertTgMedia } from 'controllers/findPlace/converter';
import { hasTgStepMedia } from 'controllers/findPlace/helpers';
import { TgMediaType } from 'core/constants';
import type * as M from 'core/api/model';

export const editTgMediaStep = async <C extends Context, T>(step: M.Step, ctx: C, keyboard?: T) => {
  const media = convertTgMedia(step);
  if (!media) return Promise.reject();

  return ctx.editMessageMedia(media, keyboard);
};

export const replyTgMediaStep = async <C extends Context, T>(step: M.Step, ctx: C, extra?: T) => {
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

export const replyURLStep = async <C extends Context, S extends string, T>(
  step: M.Step,
  url: S,
  ctx: C,
  extra?: T,
) => {
  switch (step.tgMediaType) {
    case TgMediaType.PHOTO:
      return ctx.replyWithPhoto(
        {
          url,
        },
        {
          caption: step.description,
          ...extra,
        },
      );
    case TgMediaType.VIDEO:
      return ctx.replyWithVideo(
        {
          url,
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

export const replySourceStep = async <C extends Context, S extends Buffer, T>(
  step: M.Step,
  source: S,
  ctx: C,
  extra?: T,
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
