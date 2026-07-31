import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET_NAME!;
    this.client = new S3Client({
      region: process.env.REGION_NAME,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
      },
    });
  }

  /**
   * Upload file lên S3, trả về URL công khai.
   * @param file Buffer file
   * @param originalName Tên file gốc (lấy extension)
   * @param folder Thư mục trên bucket (vd: 'products', 'posts', 'avatars')
   */
  async uploadFile(
    file: Buffer,
    originalName: string,
    folder = 'uploads',
  ): Promise<string> {
    const extension = extname(originalName).toLowerCase() || '.jpg';
    const key = `${folder}/${randomUUID()}${extension}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: this.guessContentType(extension),
      }),
    );

    this.logger.log(`Uploaded: ${key}`);
    return this.getPublicUrl(key);
  }

  /**
   * Xoá file khỏi S3 bằng URL hoặc key.
   */
  async deleteFile(urlOrKey: string): Promise<void> {
    const key = this.extractKey(urlOrKey);

    try {
      // Kiểm tra file tồn tại trước khi xoá
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      this.logger.log(`Deleted: ${key}`);
    } catch (error) {
      this.logger.warn(`File not found or delete failed: ${key}`);
    }
  }

  /** Chuyển key → URL công khai */
  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${process.env.REGION_NAME}.amazonaws.com/${key}`;
  }

  /** URL → key (để xoá) */
  private extractKey(url: string): string {
    const baseUrl = this.getPublicUrl('');
    if (url.startsWith(baseUrl)) {
      return url.slice(baseUrl.length);
    }
    return url; // đã là key
  }

  private guessContentType(extension: string): string {
    const map: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.avif': 'image/avif',
    };
    return map[extension] ?? 'application/octet-stream';
  }
}
