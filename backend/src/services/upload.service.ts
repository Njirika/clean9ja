import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { env } from '../config/env';

export class UploadService {
  private uploadDir = path.join(__dirname, '../../uploads');

  async processAndSaveImage(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    const filename = `${crypto.randomBytes(16).toString('hex')}.webp`;

    // Optimize + convert to WebP in memory (works in serverless and on a VPS).
    const optimized = await sharp(file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Production / serverless: persist to Vercel Blob (durable object storage).
    // Vercel's function filesystem is ephemeral and read-only, so local disk
    // writes would be lost. Configure BLOB_READ_WRITE_TOKEN to enable this.
    if (env.blobToken) {
      const { put } = await import('@vercel/blob');
      const { url } = await put(`${folder}/${filename}`, optimized, {
        access: 'public',
        contentType: 'image/webp',
        token: env.blobToken,
      });
      return url;
    }

    // Local development fallback: write to disk and serve via /uploads/*.
    const folderPath = path.join(this.uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    await fs.promises.writeFile(path.join(folderPath, filename), optimized);

    return `/uploads/${folder}/${filename}`;
  }
}
