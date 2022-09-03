import type * as M from 'core/api/model';

export const hasTgStepMedia = (step: M.Step): boolean => {
  return !!(step.tgMediaType && step.tgFileId);
};
