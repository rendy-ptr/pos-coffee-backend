import express from 'express';
import authRoutes from './public/auth/auth.routes';
import dashboardRouter from './guard/dashboard/dashboard.route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRouter);

export default router;
