import express from 'express';
import authenticationRoutes from './public/authentication/authentication.route';
import menuRouter from './public/menu/menu.routes';
import dashboardRouter from './guard/dashboard/dashboard.route';
import adminRouter from './guard/admin.route';
import uploadRouter from './public/upload/upload.routes';
import kasirRouter from './guard/kasir/kasir.routes';

const router = express.Router();

// public
router.use('/auth', authenticationRoutes);
router.use('/menu', menuRouter);
router.use('/upload', uploadRouter);

// protected
router.use('/dashboard', dashboardRouter);
router.use('/admin', adminRouter);
router.use('/kasir', kasirRouter);

export default router;
