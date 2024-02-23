import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.SECRET_KEY,
    });
  }
  async uploadSingleFile(
    fileBuffer: Buffer,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const stream = Readable.from(fileBuffer);
      const uploadStream = v2.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });

      stream.pipe(uploadStream);
    });
  }
  async uploadVideo(
    files: Express.Multer.File[],
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = files.map((file) => {
      return new Promise<UploadApiResponse | UploadApiErrorResponse>(
        (resolve, reject) => {
          const stream = Readable.from(file.buffer);
          const uploadStream = v2.uploader.upload_stream(
            { resource_type: 'video' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          );

          stream.pipe(uploadStream);
        },
      );
    });

    return Promise.all(uploadPromises);
  }
}
