import express from 'express';
import {
  handleGetMenus,
  handleCreateMenu,
  handleUpdateMenu,
  handleDeleteMenu,
} from '@/handlers/admin/menu.handler';
import { authMiddleware } from '@middlewares/auth';
import { validate } from '@/middlewares/validate';
import { createMenuSchema, updateMenuSchema } from '@/schemas/menu.schema';
import { UserRole } from '@prisma/client';

const router = express.Router();

/**
 * @swagger
 * /api/admin/menu:
 *   post:
 *     summary: Tambah menu (Admin)
 *     description: Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Menu]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateMenuRequest' }
 *     responses:
 *       200: { description: OK }
 *   get:
 *     summary: List semua menu (Admin)
 *     description: Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Menu]
 *     responses:
 *       200: { description: OK }
 */
router.post(
  '/',
  authMiddleware([UserRole.ADMIN]),
  validate(createMenuSchema),
  handleCreateMenu
);

router.get('/', authMiddleware([UserRole.ADMIN]), handleGetMenus);

/**
 * @swagger
 * /api/admin/menu/{id}:
 *   patch:
 *     summary: Edit menu (Admin)
 *     description: Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Menu]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateMenuRequest' }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Hapus menu (Admin)
 *     description: Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Menu]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: OK }
 */
router.patch(
  '/:id',
  authMiddleware([UserRole.ADMIN]),
  validate(updateMenuSchema),
  handleUpdateMenu
);

router.delete('/:id', authMiddleware([UserRole.ADMIN]), handleDeleteMenu);

export default router;
