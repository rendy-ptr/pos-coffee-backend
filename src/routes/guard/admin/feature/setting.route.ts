import express from 'express';
import { editAdminProfile } from '@/controllers/admin/admin.controller';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.patch('/:id', authMiddleware([UserRole.ADMIN]), editAdminProfile);

export default router;
