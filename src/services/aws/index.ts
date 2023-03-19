import { PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';

import {
  AWS_REGION,
  S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from 'shared/helpers/env';

class Aws {
  constructor() {
    this.S3 = new S3({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private readonly S3: S3;

  public async getObject(key: string, bucket: string = S3_BUCKET_NAME) {
    return this.S3.getObject({
      Bucket: bucket,
      Key: key,
    });
  }

  public async putObject(
    body: PutObjectCommandInput['Body'],
    ext: string,
    bucket: string = S3_BUCKET_NAME,
  ) {
    return this.S3.putObject({
      Body: body,
      Key: v4() + ext,
      Bucket: bucket,
    });
  }
}

export { Aws };
