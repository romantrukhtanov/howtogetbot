import { Context, Composer } from 'telegraf';

import { DEFAULT_MESSAGES } from './constants';
import { getButton, getPageData } from './helpers';
import type {
  IPaginationProps,
  IPaginationMessages,
  FormatFn,
  HeaderFn,
  OnChangeFn,
  OnShowStepsFn,
  ButtonType,
} from './model';

class Pagination<T> {
  constructor({
    data = [],
    pageSize = 1,
    rowSize = 1,
    currentPage = 1,
    onChange,
    onShowSteps,
    format,
    header,
    messages = DEFAULT_MESSAGES,
  }: IPaginationProps<T>) {
    this.data = data;
    this.pageSize = pageSize;
    this.rowSize = rowSize;
    this.currentPage = currentPage;
    this.onChange = onChange;
    this.onShowSteps = onShowSteps;
    this.format = format;
    this.header = header;
    this.messages = messages;
    this.total = this.data.length;
    this.totalPages = Math.ceil(this.total / this.pageSize);
    this.format = format;
    this.header = header;
    this.onChange = onChange;
    this.onShowSteps = onShowSteps;
    this.messages = Object.assign(DEFAULT_MESSAGES, messages);

    this.callbackStr = Math.random().toString(36).slice(2);

    this.currentItems = [];
  }

  data: T[];
  currentPage: number;
  messages: IPaginationMessages;
  onChange: OnChangeFn;
  onShowSteps: OnShowStepsFn;
  header: HeaderFn;
  format: FormatFn<T>;
  total: number;
  pageSize: number;
  rowSize: number;

  private currentItems: T[];
  private readonly totalPages: number;
  private readonly callbackStr: string;

  private async setCurrentItems(): Promise<void> {
    this.currentItems = getPageData<T>(this.data as T[], this.currentPage, this.pageSize);
  }

  async step() {
    await this.setCurrentItems();

    // const header = this.header(this.currentPage, this.pageSize, this.total);
    // const itemsText = this.currentItems.map(this.format).join('\n');

    return this.currentItems[0];
  }

  async steps() {
    return this.data;
  }

  async keyboard() {
    await this.setCurrentItems();

    const keyboard: Array<ButtonType<string>[]> = [];

    const row: ButtonType<string>[] = [];

    const prevBtnMessage = !this.isFirstPage ? this.messages.prev : '\n';
    const nextBtnMessage = !this.isLastPage ? this.messages.next : '\n';

    // Index Controls
    keyboard.push([getButton('📝 Show all steps', `${this.callbackStr}-steps`)]);
    row.push(getButton(prevBtnMessage, `${this.callbackStr}-prev`));
    row.push(getButton(this.messages.delete, `${this.callbackStr}-delete`));
    row.push(getButton(nextBtnMessage, `${this.callbackStr}-next`));
    keyboard.push(row);

    // Give ready-to-use Telegram Markup object
    return {
      reply_markup: { inline_keyboard: keyboard },
    };
  }

  get isFirstPage() {
    return this.currentPage <= 1;
  }

  get isLastPage() {
    return this.currentPage >= this.totalPages;
  }

  async getIndexButtons() {
    const keyboard: Array<ButtonType<string>[]> = [];

    let row: ButtonType<string>[] = [];

    // Index buttons
    for (let i = 0; i < this.currentItems.length; i += 1) {
      if (!(i % this.rowSize) && row.length) {
        keyboard.push(row);
        row = [];
      }
      const button = getButton(`${this.currentPage * (i + 1)}`, `${this.callbackStr}-${i}`);
      row.push(button);
    }
    keyboard.push(row);

    return keyboard;
  }

  handleActions<K extends Context>(composer: Composer<K>): void {
    composer.action(new RegExp(`${this.callbackStr}-(.+)`), async ctx => {
      const data = ctx.match[1];
      switch (data) {
        case 'prev':
          if (this.isFirstPage) {
            await ctx.answerCbQuery();
            return;
          }
          this.currentPage -= 1;
          this.onChange(ctx);
          break;
        case 'next':
          if (this.isLastPage) {
            await ctx.answerCbQuery();
            return;
          }
          this.currentPage += 1;
          this.onChange(ctx as Context);
          break;
        case 'delete':
          await ctx.deleteMessage();
          await ctx.answerCbQuery();
          break;
        case 'steps':
          this.onShowSteps(ctx);
          break;
        default:
          await ctx.answerCbQuery();
          break;
      }
    });
  }
}

export { Pagination };
