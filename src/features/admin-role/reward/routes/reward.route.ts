import express from 'express';
import {
  handleGetReward,
  handleCreateReward,
  handleUpdateReward,
  handleDeleteReward,
  handleGetRewardDetail,
} from '@/features/admin-role/reward/handlers/reward.handler';
import { authMiddleware } from '@middlewares/auth';
import { validate } from '@/middlewares/validate';
import {
  createRewardSchema,
  updateRewardSchema,
} from '@/features/admin-role/reward/schemas/reward.schema';
import { UserRole } from '@prisma/client';

const router = express.Router();

/**
 * @swagger
 * /api/admin/reward:
 *   post:
 *     summary: Tambah reward (Admin)
 *     description: Membuat reward atau voucher baru. Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Reward]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateRewardRequest' }
 *     responses:
 *       200:
 *         description: Reward berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Reward Free Coffee berhasil dibuat' }
 *                 data: { $ref: '#/components/schemas/RewardMutateResponse' }
 *       404: { description: Not Found }
 *       409: { description: Conflict - Business rule violation }
 *       500: { description: Internal Server Error }
 *   get:
 *     summary: List semua reward (Admin)
 *     description: Mengambil daftar semua reward dan voucher. Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Reward]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar reward
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Berhasil mendapatkan 5 Reward' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/RewardListResponse' }
 *       500: { description: Internal Server Error }
 */
router.post(
  '/',
  authMiddleware([UserRole.ADMIN]),
  validate(createRewardSchema),
  handleCreateReward
);

router.get('/', authMiddleware([UserRole.ADMIN]), handleGetReward);

/**
 * @swagger
 * /api/admin/reward/{id}:
 *   patch:
 *     summary: Edit reward (Admin)
 *     description: Memperbarui data reward berdasarkan ID. Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Reward]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string }, description: 'ID reward' }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateRewardRequest' }
 *     responses:
 *       200:
 *         description: Reward berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Reward Free Coffee berhasil diperbarui' }
 *                 data: { $ref: '#/components/schemas/RewardMutateResponse' }
 *       404: { description: Reward tidak ditemukan }
 *       409: { description: Conflict - Business rule violation }
 *       500: { description: Internal Server Error }
 *   delete:
 *     summary: Hapus reward (Admin)
 *     description: Menghapus reward berdasarkan ID. Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Reward]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string }, description: 'ID reward' }]
 *     responses:
 *       200:
 *         description: Reward berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Reward Free Coffee berhasil dihapus' }
 *                 data: { type: 'null', example: null }
 *       404: { description: Reward tidak ditemukan }
 *       500: { description: Internal Server Error }
 *   get:
 *     summary: Detail reward (Admin)
 *     description: Mengambil detail reward berdasarkan ID. Membutuhkan role ADMIN via cookie 'token'
 *     tags: [Reward]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string }, description: 'ID reward' }]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan detail reward
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Berhasil mendapatkan detail Reward Free Coffee' }
 *                 data: { $ref: '#/components/schemas/RewardDetailResponse' }
 *       404: { description: Reward tidak ditemukan }
 *       500: { description: Internal Server Error }
 */
router.patch(
  '/:id',
  authMiddleware([UserRole.ADMIN]),
  validate(updateRewardSchema),
  handleUpdateReward
);

router.delete('/:id', authMiddleware([UserRole.ADMIN]), handleDeleteReward);

router.get('/:id', authMiddleware([UserRole.ADMIN]), handleGetRewardDetail);

export default router;
