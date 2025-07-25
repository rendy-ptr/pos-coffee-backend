import express from 'express';
import { authMiddleware } from '@middlewares/auth';
import { customerDashboard } from '@controllers/customer/customer.controller';

const dashboardRouter = express.Router();

dashboardRouter.get(
  '/customer',
  authMiddleware(['CUSTOMER']),
  customerDashboard
);
// dashboardRouter.get('/kasir', authMiddleware(['KASIR']), kasirDashboard);
// dashboardRouter.get('/admin', authMiddleware(['ADMIN']), adminDashboard);

export default dashboardRouter;
