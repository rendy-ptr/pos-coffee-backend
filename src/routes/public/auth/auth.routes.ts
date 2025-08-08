import express from 'express';
import {
  registerCustomer,
  loginAuth,
  logoutAuth,
} from '@/controllers/auth/auth.controller';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';

const auth = express.Router();

auth.post('/register', registerCustomer);
auth.post('/login', loginAuth);
auth.use(
  '/logout',
  authMiddleware([UserRole.CUSTOMER, UserRole.KASIR, UserRole.ADMIN]),
  logoutAuth
);

export default auth;
