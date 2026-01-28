import express from 'express';
import categoryRoutes from './feature/category.route';
import menuRoutes from './feature/menu.route';
import kasirRoutes from './feature/kasir.route';
import tableRoutes from './feature/table.route';
import rewardRoutes from './feature/reward.route';
import settingRoutes from './feature/setting.route';

const adminRouter = express.Router();

adminRouter.use('/category', categoryRoutes);
adminRouter.use('/menu', menuRoutes);
adminRouter.use('/kasir', kasirRoutes);
adminRouter.use('/table', tableRoutes);
adminRouter.use('/reward', rewardRoutes);
adminRouter.use('/setting', settingRoutes);

export default adminRouter;
