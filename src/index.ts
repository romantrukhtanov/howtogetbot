import { Telegraf } from 'telegraf';

import { BOT_TOKEN, BOT_DEV_TOKEN, IS_PRODUCTION } from 'shared/helpers/env';
import { Bot } from 'core/bot';

const bot = new Telegraf(IS_PRODUCTION ? BOT_TOKEN : BOT_DEV_TOKEN);

const howToGetApp = new Bot(bot);
howToGetApp.init();
