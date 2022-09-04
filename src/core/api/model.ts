import type { TgMediaType } from 'core/constants';

export interface Form {
  id: number;
  userName: string;
  tgUserId: number;
  title: string;
  addressUrl: string;
  address: object; // read-only
  steps: Step[];
}

export interface Step {
  id: number;
  number: number;
  formId: number;
  fileAttachmentId: number;
  description: string;
  fileKey?: string;
  tgMediaType?: TgMediaType;
  tgFileId?: string;
}

export interface FileAttachment {
  id: number;
  stepId: number;
  name: string;
  size: number;
  content: string;
}
