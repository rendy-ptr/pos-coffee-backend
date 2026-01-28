import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';
import express from 'express';

import { getMenus } from '@/controllers/kasir/menu.controller';
import { getActiveCategories } from '@/controllers/kasir/category.controller';
import { getTables } from '@/controllers/kasir/table.controller';
import { getMemberId } from '@/controllers/kasir/kasir.controller';

const kasirRouter = express.Router();

kasirRouter.get('/menu', authMiddleware([UserRole.KASIR]), getMenus);
kasirRouter.get(
  '/category',
  authMiddleware([UserRole.KASIR]),
  getActiveCategories
);
kasirRouter.get('/table', authMiddleware([UserRole.KASIR]), getTables);
kasirRouter.get('/member', authMiddleware([UserRole.KASIR]), getMemberId);

export default kasirRouter;
