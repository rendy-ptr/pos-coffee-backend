import express from 'express';
import menuRoutes from './menuRoutes.ts';

const router = express.Router();

router.use('/menus', menuRoutes);

export default router;
