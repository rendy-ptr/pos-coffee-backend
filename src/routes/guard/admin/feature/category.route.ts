import express from 'express';
import {
  handleCreateCategory,
  handleGetCategories,
  handleUpdateCategory,
  handleDeleteCategory,
} from '@/handlers/admin/category.handler';
import { authMiddleware } from '@middlewares/auth';
import { validate } from '@/middlewares/validate';
import {
  createCategorySchema,
  updateCategorySchema,
} from '@/schemas/category.schema';
import { UserRole } from '@prisma/client';

const router = express.Router();

/**
 * @swagger
 * /api/admin/category:
 *   post:
 *     summary: Tambah kategori (Admin)
 *     description: Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Category]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCategoryRequest' }
 *     responses:
 *       200: { description: OK }
 *   get:
 *     summary: List kategori (Admin)
 *     description: Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Category]
 *     responses:
 *       200: { description: OK }
 */
router.post(
  '/',
  authMiddleware([UserRole.ADMIN]),
  validate(createCategorySchema),
  handleCreateCategory
);

router.get('/', authMiddleware([UserRole.ADMIN]), handleGetCategories);

/**
 * @swagger
 * /api/admin/category/{id}:
 *   patch:
 *     summary: Edit kategori (Admin)
 *     description: Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Category]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateCategoryRequest' }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Hapus kategori (Admin)
 *     description: Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Category]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: OK }
 */
router.patch(
  '/:id',
  authMiddleware([UserRole.ADMIN]),
  validate(updateCategorySchema),
  handleUpdateCategory
);

router.delete('/:id', authMiddleware([UserRole.ADMIN]), handleDeleteCategory);

export default router;
