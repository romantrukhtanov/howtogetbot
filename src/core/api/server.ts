import { TgMediaType } from 'core/constants';

export interface FormResponse {
  id: number;
  username: string;
  tg_user_id: number;
  title: string;
  steps: StepResponse[];
  address: AddressResponse;
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

export interface FileAttachmentResponse {
  id: number;
  step_id: number;
  name: string;
  size: number;
  content: string;
}

export interface AddressResponse {
  id: 3;
  country: string;
  city: string;
  street_1: string;
  street_2?: null;
  zip: number;
  full_address: string;
  form_id: number;
  short_url: string;
  url: string;
  latitude: number;
  longitude: number;
  short_name: null;
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
