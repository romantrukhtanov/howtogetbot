import AWS from 'aws-sdk';
import { v4 } from 'uuid';

import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
} from 'shared/helpers/env';

class Aws {
  constructor() {
    this.updateConfig();
    this.S3 = new AWS.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
  }

  private readonly S3: AWS.S3;

  public async getObject(key: AWS.S3.ObjectKey, bucket: AWS.S3.BucketName = S3_BUCKET_NAME) {
    const response = this.S3.getObject({
      Bucket: bucket,
      Key: key,
    });

    return response.createReadStream();
  }

  public async putObject(
    body: AWS.S3.Body,
    ext: string,
    bucket: AWS.S3.BucketName = S3_BUCKET_NAME,
  ) {
    const key = v4();
    return this.S3.putObject({
      Body: body,
      Key: key + ext,
      Bucket: bucket,
    }).promise();
  }

  private updateConfig() {
    AWS.config.update({
      region: AWS_REGION,
    });
  }
}

export { Aws };
