import * as S from './server';
import * as M from './model';

export function convertForm(form: S.FormResponse): M.Form {
  const steps = form?.steps?.map(convertStep) ?? [];
  const address = convertAddress(form.address);

  return {
    id: form.id,
    userName: form.username,
    tgUserId: form.tg_user_id,
    title: form.title,
    token: form.token,
    address,
    steps,
  };
}

export function convertStep(step: S.StepResponse): M.Step {
  return {
    id: step.id,
    number: step.number,
    formId: step.form_id,
    description: step.description,
    fileAttachmentId: step.file_attachment_id,
    fileKey: step.file_key,
    tgMediaType: step.tg_media_type,
    tgFileId: step.tg_file_id,
  };
}

export function convertFileAttachment(file: S.FileAttachmentResponse): M.FileAttachment {
  return {
    id: file.id,
    stepId: file.step_id,
    name: file.name,
    size: file.size,
    content: file.content,
  };
}

export function convertAddress(address: S.AddressResponse): M.Address {
  return {
    id: address.id,
    country: address.country,
    city: address.city,
    street1: address.street_1,
    street2: address.street_2,
    zip: address.zip,
    fullAddress: address.full_address,
    formId: address.form_id,
    shortUrl: address.short_url,
    url: address.url,
    latitude: address.latitude,
    longitude: address.longitude,
    shortName: address.short_name,
  };
}
