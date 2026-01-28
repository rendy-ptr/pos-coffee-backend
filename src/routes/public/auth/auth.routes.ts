import express from 'express';
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleAuthMe,
} from '@/handlers/auth/auth.handler';
import { optionalAuth } from '@middlewares/auth';
import { validate } from '@/middlewares/validate';
import { registerSchema, loginSchema } from '@/schemas/register.schema';

const auth = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register customer
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterRequest' }
 *     responses:
 *       200: { description: OK }
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginRegisterRequest' }
 *     responses:
 *       200: { description: OK }
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     responses:
 *       200: { description: OK }
 */
auth.post('/register', validate(registerSchema), handleRegister);
auth.post('/login', validate(loginSchema), handleLogin);
auth.post('/logout', handleLogout);
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Cek profile
 *     tags: [Auth]
 *     responses:
 *       200: { description: OK }
 */
auth.get('/me', optionalAuth, handleAuthMe);

export default auth;
