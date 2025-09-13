import express from 'express';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';
import { customerDashboard } from '@controllers/customer/customer.controller';
import { kasirDashboard } from '@controllers/kasir/kasir.controller';
import { adminDashboard } from '@controllers/admin/admin.controller';

const dashboardRouter = express.Router();

dashboardRouter.get(
  '/customer',
  authMiddleware([UserRole.CUSTOMER]),
  customerDashboard
);
dashboardRouter.get('/kasir', authMiddleware([UserRole.KASIR]), kasirDashboard);
dashboardRouter.get('/admin', authMiddleware([UserRole.ADMIN]), adminDashboard);

export default dashboardRouter;
