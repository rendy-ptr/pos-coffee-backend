import express from 'express';
import {
  handleCreateKasir,
  handleDeleteKasir,
  handleGetKasir,
  handleUpdateKasir,
  handleGetKasirDetail,
} from '@/handlers/admin/kasir.handle';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';
import { validate } from '@/middlewares/validate';
import { createKasirSchema, updateKasirSchema } from '@/schemas/kasir.schema';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Kasir
 *   description: Manajemen data kasir
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateKasirRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - shiftStart
 *         - shiftEnd
 *       properties:
 *         name:
 *           type: string
 *           description: Nama lengkap kasir
 *         email:
 *           type: string
 *           format: email
 *           description: Email kasir (unik)
 *         phone:
 *           type: string
 *           description: Nomor telepon kasir (min 10 digit)
 *         profilePicture:
 *           type: string
 *           description: URL foto profil (opsional)
 *         shiftStart:
 *           type: string
 *           description: Waktu mulai shift
 *         shiftEnd:
 *           type: string
 *           description: Waktu selesai shift
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Status aktif kasir
 *     UpdateKasirRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         profilePicture:
 *           type: string
 *         shiftStart:
 *           type: string
 *         shiftEnd:
 *           type: string
 *         isActive:
 *           type: boolean
 *     KasirResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [KASIR]
 *         kasirProfile:
 *           type: object
 *           properties:
 *             shiftStart:
 *               type: string
 *             shiftEnd:
 *               type: string
 */

/**
 * @swagger
 * /api/admin/kasir:
 *   post:
 *     summary: Buat akun kasir baru
 *     tags: [Kasir]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateKasirRequest'
 *     responses:
 *       201:
 *         description: Kasir berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KasirResponse'
 *       400:
 *         description: Validasi gagal atau email sudah terdaftar
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware([UserRole.ADMIN]),
  validate(createKasirSchema),
  handleCreateKasir
);

/**
 * @swagger
 * /api/admin/kasir:
 *   get:
 *     summary: Ambil daftar semua kasir
 *     tags: [Kasir]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kasir
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KasirResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware([UserRole.ADMIN]), handleGetKasir);

/**
 * @swagger
 * /api/admin/kasir/{id}:
 *   patch:
 *     summary: Update data kasir
 *     tags: [Kasir]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kasir
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateKasirRequest'
 *     responses:
 *       200:
 *         description: Kasir berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KasirResponse'
 *       404:
 *         description: Kasir tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id',
  authMiddleware([UserRole.ADMIN]),
  validate(updateKasirSchema),
  handleUpdateKasir
);

/**
 * @swagger
 * /api/admin/kasir/{id}:
 *   delete:
 *     summary: Hapus kasir
 *     tags: [Kasir]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kasir
 *     responses:
 *       200:
 *         description: Kasir berhasil dihapus
 *       404:
 *         description: Kasir tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware([UserRole.ADMIN]), handleDeleteKasir);

/**
 * @swagger
 * /api/admin/kasir/{id}:
 *   get:
 *     summary: Ambil detail kasir
 *     tags: [Kasir]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kasir
 *     responses:
 *       200:
 *         description: Detail kasir
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KasirResponse'
 *       404:
 *         description: Kasir tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authMiddleware([UserRole.ADMIN]), handleGetKasirDetail);

export default router;
