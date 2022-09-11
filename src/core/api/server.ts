import { TgMediaType } from 'core/constants';

export interface FormResponse {
  id: number;
  username: string;
  tg_user_id: number;
  title: string;
  address_url: string;
  steps: StepResponse[];
  address: object;
}

export interface FileAttachmentResponse {
  id: number;
  step_id: number;
  name: string;
  size: number;
  content: string;
}

export interface StepResponse {
  id: number;
  number: number;
  form_id: number;
  description: string;
  file_attachment_id: number;
  tg_media_type: TgMediaType;
  file_key: string;
  tg_file_id: string;
}

export interface StepTgMediaRequest {
  step: {
    form_id: number;
    tg_media_type: TgMediaType;
    tg_file_id: string;
  };
}

export interface FileAttachmentRequest {
  file_attachment: {
    step_id: number;
    content: string;
  };
}
