import { wait } from './wait';

export const retryOperation = (operation: () => Promise<void>, delay: number, retries: number) => {
  return new Promise<void>((resolve, reject) => {
    operation()
      .then(resolve)
      .catch(reason => {
        if (retries > 0) {
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });
};
