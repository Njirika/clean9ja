import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { ApiResponse } from '../utils/ApiResponse';

const uploadService = new UploadService();

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json(ApiResponse.error('No file provided'));
    }

    const folder = req.body.folder || 'general';
    const fileUrl = await uploadService.processAndSaveImage(req.file, folder);

    res.status(200).json(ApiResponse.success('File uploaded successfully', { url: fileUrl }));
  } catch (error) {
    next(error);
  }
};
