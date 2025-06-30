import express from 'express';
import { authMiddleware, restrictTo } from '@/middlewares/auth';
// import menuRoutes from './menus/menu.routes.ts';
import authRoutes from './public/auth/auth.routes';
import adminRouter from './guard/admin/admin.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', authMiddleware, restrictTo('admin'), adminRouter);
// router.use('/menus', menuRoutes);

export default router;
