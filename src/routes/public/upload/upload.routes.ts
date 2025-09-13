import { Router } from 'express';
import { upload } from '@/config/cloudinary';
import { createUpload } from '@/controllers/public/upload/upload.controller';

const uploadRouter = Router();

uploadRouter.post('/', upload.single('image'), createUpload);

export default uploadRouter;
