export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const BOT_DEV_TOKEN = process.env.BOT_DEV_TOKEN as string;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const AWS_REGION = process.env.AWS_REGION as string;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;

export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME as string;

export const HOW_TO_GET_IMAGE_ID =
  process.env.HOW_TO_GET_IMAGE_ID ??
  'AgACAgIAAxkBAAIK5GMB7qMjxUK_kXD4ERHcHTy3ux7TAAJDvzEb3GYQSK7PtAueaQmpAQADAgADeQADKQQ';

export const HOW_TO_GET_PRELOADER_ID =
  process.env.HOW_TO_GET_PRELOADER_ID ??
  'AgACAgIAAxkBAAILL2MB-9nHsbcPMFI0aRhL126Xe2GWAAKVvzEb3GYQSPgzugWc3U2lAQADAgADeQADKQQ';

export const TELEGRAM_BOT_NAME = IS_PRODUCTION ? 'how2get_bot' : 'how2get_dev_bot';

export const TELEGRAM_BOT_LINK = `https://t.me/${TELEGRAM_BOT_NAME}`;
