import express from 'express';
import categoryRoutes from '../../features/admin-role/category/routes/category.route';
import menuRoutes from '../../features/admin-role/menu/routes/menu.route';
import cashierRoutes from '../../features/admin-role/cashier/routes/cashier.route';
import tableRoutes from '../../features/admin-role/table/routes/table.route';
import rewardRoutes from '../../features/admin-role/reward/routes/reward.route';

const adminRouter = express.Router();

adminRouter.use('/category', categoryRoutes);
adminRouter.use('/menu', menuRoutes);
adminRouter.use('/cashier', cashierRoutes);
adminRouter.use('/table', tableRoutes);
adminRouter.use('/reward', rewardRoutes);

export default adminRouter;
