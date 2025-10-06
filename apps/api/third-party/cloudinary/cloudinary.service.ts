import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'vehicle_inspection' }, (error, result) => {
          if (error) return reject(new Error(error.message || 'Upload failed'));
          if (!result) return reject(new Error('Upload result is undefined'));
          resolve(result);
        })
        .end(file.buffer);
    });
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      return results.map((result) => result.secure_url);
    } catch (error) {
      throw new Error(
        `Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
