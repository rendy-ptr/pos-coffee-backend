import express from 'express';
import authRoutes from './public/auth/auth.routes';
import menuRouter from './public/menu/menu.routes';
import dashboardRouter from './guard/dashboard/dashboard.route';
import adminRouter from './guard/admin/admin.routes';
import uploadRouter from './public/upload/upload.routes';

const router = express.Router();

// public
router.use('/auth', authRoutes);
router.use('/menu', menuRouter);
router.use('/upload', uploadRouter);

// protected
router.use('/dashboard', dashboardRouter);
router.use('/admin', adminRouter);

export default router;
