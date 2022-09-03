import { ButtonType } from './model';

export const getPageData = <T>(data: T[], page: number, pageSize: number): T[] =>
  data.slice((page - 1) * pageSize, page * pageSize);

export const getButton = <T>(text: string, callbackData: T): ButtonType<T> => ({
  text,
  callback_data: callbackData,
});
