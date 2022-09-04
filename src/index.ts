import { Telegraf } from 'telegraf';

import { BOT_TOKEN } from 'shared/helpers/env';
import { Bot } from 'core/bot';

const bot = new Telegraf(BOT_TOKEN);

const howToGetApp = new Bot(bot);
howToGetApp.init();
