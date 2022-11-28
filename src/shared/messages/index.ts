import { TELEGRAM_BOT_LINK } from 'shared/helpers/env';
import type * as M from 'core/api/model';

export const getShareFormMessage = (form: M.Form) => {
  const {
    id,
    title,
    address: { fullAddress },
  } = form;

  const tgShareLink = `${TELEGRAM_BOT_LINK}?start=form_${id}`;
  return `📜 ${title}\n\n🌏 ${fullAddress}\n\nShare link:\n${tgShareLink}`;
};
