import { TgMediaType } from 'core/constants';
import type { Services } from 'services';

import { convertFileAttachment, convertForm, convertStep } from './converter';
import type * as S from './server';
import type * as M from './model';

class Api {
  constructor(private readonly services: Services) {}

  public async findPlaces(message: string): Promise<M.Form[] | null> {
    try {
      const { data } = await this.services.httpActions.get<S.FormResponse[]>(
        `search_forms?address=${message}`,
      );

      if (!data.length) {
        return null;
      }

      return data.map(item => convertForm(item));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getPlace(id: number): Promise<M.Form | null> {
    try {
      const { data } = await this.services.httpActions.get<S.FormResponse>(`forms/${id}`);

      return convertForm(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getContentMedia(fileId: number): Promise<M.FileAttachment | null> {
    try {
      const { data } = await this.services.httpActions.get<S.FileAttachmentResponse>(
        `file_attachments/${fileId}`,
      );

      return convertFileAttachment(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async downloadFile(fileId: number) {
    try {
      const { data } = await this.services.httpActions.get(`file_attachments/${fileId}/download`);

      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async uploadFile(stepId: number, content: string) {
    try {
      const { data } = await this.services.httpActions.post<
        S.FileAttachmentRequest,
        S.FileAttachmentResponse
      >(`file_attachments`, {
        file_attachment: {
          step_id: stepId,
          content,
        },
      });

      return convertFileAttachment(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public getFileLink(fileId: number) {
    return `${this.services.httpActions.apiUrl}/file_attachments/${fileId}/download`;
  }

  public async updateStepTgMedia(step: M.Step): Promise<M.Step | null> {
    try {
      const { data } = await this.services.httpActions.put<S.StepTgMediaRequest, S.StepResponse>(
        `steps/${step.id}`,
        {
          step: {
            form_id: step.formId,
            tg_media_type: step.tgMediaType as TgMediaType,
            tg_file_id: step.tgFileId as string,
          },
        },
      );

      return convertStep(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export { Api };
