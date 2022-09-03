import { Context } from 'telegraf';

export interface IPaginationMessages {
  [Key: string]: string;
}

export type OnChangeFn = <C extends Context>(context: C) => void;
export type OnShowStepsFn = <C extends Context>(context: C) => void;
export type HeaderFn = (currentPage: number, pageSize: number, total: number) => string;
export type FormatFn<T> = (item: T, index: number) => void;

export interface IPaginationProps<T> {
  data: T[];
  onChange: OnChangeFn;
  onShowSteps: OnShowStepsFn;
  header: HeaderFn;
  format: FormatFn<T>;
  pageSize?: number;
  rowSize?: number;
  currentPage?: number;
  messages?: IPaginationMessages;
}

export interface ButtonType<T> {
  text: string;
  callback_data: T;
}
