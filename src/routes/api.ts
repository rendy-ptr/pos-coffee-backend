import express from 'express';
// import menuRoutes from './menus/menu.routes.ts';
import authRoutes from './customer/customer.routes.ts';

const router = express.Router();

router.use('/auth', authRoutes);
// router.use('/menus', menuRoutes);

export default router;
