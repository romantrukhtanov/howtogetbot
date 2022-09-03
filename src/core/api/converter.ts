import * as S from './server';
import * as M from './model';

export function convertForm(form: S.FormResponse): M.Form {
  const steps = form.steps.map(convertStep);
  return {
    id: form.id,
    userName: form.username,
    tgUserId: form.tg_user_id,
    title: form.title,
    fullAddress: form.full_address,
    address: form.address,
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
