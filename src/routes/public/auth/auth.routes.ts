import express from 'express';
import {
  registerCustomer,
  loginAuth,
  logoutAuth,
  authMe,
} from '@/controllers/auth/auth.controller';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';

const auth = express.Router();

auth.post('/register', registerCustomer);
auth.post('/login', loginAuth);
auth.post('/logout', logoutAuth);
auth.get(
  '/me',
  authMiddleware([UserRole.ADMIN, UserRole.KASIR, UserRole.CUSTOMER]),
  authMe
);

export default auth;
