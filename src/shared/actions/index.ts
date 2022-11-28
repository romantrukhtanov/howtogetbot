import { Context } from 'telegraf';

import { TELEGRAM_BOT_LINK } from 'shared/helpers/env';
import type * as M from 'core/api/model';

export const shareForm = async <TContext extends Context>(ctx: TContext, form: M.Form) => {
  const {
    id,
    title,
    address: { fullAddress },
  } = form;

  const tgShareLink = `${TELEGRAM_BOT_LINK}?start=form_${id}`;
  const formText = `📜 ${title}\n\n🌏 ${fullAddress}\n\nShare link:\n${tgShareLink}`;

  return ctx.reply(formText);
};
