import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private cloudinaryConfigured = false;

  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.cloudinaryConfigured = true;
      console.log('[Storage] Cloudinary configured successfully');
    } else {
      console.warn('[Storage] Cloudinary not configured, using fallback mode');
    }
  }

  /**
   * Upload a buffer to Cloudinary
   * @param buffer The file buffer
   * @param folder Subfolder in Cloudinary (e.g., 'ads')
   * @param filename Original filename for public_id
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string = 'ads',
    filename?: string,
  ): Promise<{ url: string; publicId: string } | null> {
    if (!this.cloudinaryConfigured) {
      console.warn('[Storage] Cloudinary not configured, cannot upload');
      return null;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: filename ? filename.replace(/\.[^.]+$/, '') : undefined,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            console.error('[Storage] Cloudinary upload error:', error);
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error('No result from Cloudinary'));
          }
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Upload base64 image data to Cloudinary
   */
  async uploadBase64(
    base64Data: string,
    folder: string = 'ads',
    filename?: string,
  ): Promise<{ url: string; publicId: string } | null> {
    if (!this.cloudinaryConfigured) {
      return null;
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Data,
        {
          folder,
          public_id: filename ? filename.replace(/\.[^.]+$/, '') : undefined,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            console.error('[Storage] Cloudinary upload error:', error);
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error('No result from Cloudinary'));
          }
        },
      );
    });
  }

  /**
   * Delete a file from Cloudinary
   */
  async deleteFile(publicId: string): Promise<boolean> {
    if (!this.cloudinaryConfigured) {
      return false;
    }

    return new Promise((resolve) => {
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) {
          console.error('[Storage] Cloudinary delete error:', error);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Get the public URL for a file
   */
  getPublicUrl(publicId: string): string {
    if (!this.cloudinaryConfigured) {
      return '';
    }
    return cloudinary.url(publicId, { secure: true });
  }
}
