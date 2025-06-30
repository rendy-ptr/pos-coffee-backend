import express from 'express';
import { registerAdmin } from '@/controllers/admin/admin.controller';

const adminRouter = express.Router();

adminRouter.get('/', registerAdmin);
export default adminRouter;
