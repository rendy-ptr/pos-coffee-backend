import { Request, Response } from 'express';
import { uploadToCloudinary } from '@/config/cloudinary';

export const createUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const result = await uploadToCloudinary(req.file.buffer, 'kasirs');
    const originalUrl = result.secure_url;

    res.json({
      imageUrl: originalUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload gagal' });
  }
};
