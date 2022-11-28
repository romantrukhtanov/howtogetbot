import type { TgMediaType } from 'core/constants';

export interface Form {
  id: number;
  userName: string;
  tgUserId: number;
  title: string;
  address: Address; // read-only
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

export interface Address {
  id: number;
  country: string;
  city: string;
  street1: string;
  street2?: null;
  zip: number;
  fullAddress: string;
  formId: number;
  shortUrl: string;
  url: string;
  latitude: number;
  longitude: number;
  shortName: null;
}
