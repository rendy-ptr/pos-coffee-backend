import express from 'express';
import {
  handleCreateCashier,
  handleDeleteCashier,
  handleGetAllCashiers,
  handleUpdateCashier,
  handleGetCashierDetail,
} from '@/features/admin-role/cashier/handlers/cashier.handle';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';
import { validate } from '@/middlewares/validate';
import {
  createCashierSchema,
  updateCashierSchema,
} from '@/features/admin-role/cashier/schemas/cashier.schema';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cashier
 *   description: Cashier management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCashierRequest:
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
 *           description: Cashier full name
 *         email:
 *           type: string
 *           format: email
 *           description: Cashier email (unique)
 *         phone:
 *           type: string
 *           description: Cashier phone number (min 10 digits)
 *         profilePicture:
 *           type: string
 *           description: Profile picture URL (optional)
 *         shiftStart:
 *           type: string
 *           description: Shift start time
 *         shiftEnd:
 *           type: string
 *           description: Shift end time
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Cashier active status
 *     UpdateCashierRequest:
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
 *     CashierResponse:
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
 *           enum: [CASHIER]
 *         cashierProfile:
 *           type: object
 *           properties:
 *             shiftStart:
 *               type: string
 *             shiftEnd:
 *               type: string
 */

/**
 * @swagger
 * /api/admin/cashier:
 *   post:
 *     summary: Create a new cashier account
 *     tags: [Cashier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCashierRequest'
 *     responses:
 *       201:
 *         description: Cashier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashierResponse'
 *       400:
 *         description: Validation failed or email already registered
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware([UserRole.ADMIN]),
  validate(createCashierSchema),
  handleCreateCashier
);

/**
 * @swagger
 * /api/admin/cashier:
 *   get:
 *     summary: Get all cashiers
 *     tags: [Cashier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cashiers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CashierResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware([UserRole.ADMIN]), handleGetAllCashiers);

/**
 * @swagger
 * /api/admin/cashier/{id}:
 *   patch:
 *     summary: Update cashier data
 *     tags: [Cashier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cashier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCashierRequest'
 *     responses:
 *       200:
 *         description: Cashier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashierResponse'
 *       404:
 *         description: Cashier not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id',
  authMiddleware([UserRole.ADMIN]),
  validate(updateCashierSchema),
  handleUpdateCashier
);

/**
 * @swagger
 * /api/admin/cashier/{id}:
 *   delete:
 *     summary: Delete a cashier
 *     tags: [Cashier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cashier ID
 *     responses:
 *       200:
 *         description: Cashier deleted successfully
 *       404:
 *         description: Cashier not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware([UserRole.ADMIN]), handleDeleteCashier);

/**
 * @swagger
 * /api/admin/cashier/{id}:
 *   get:
 *     summary: Get cashier detail
 *     tags: [Cashier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cashier ID
 *     responses:
 *       200:
 *         description: Cashier detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashierResponse'
 *       404:
 *         description: Cashier not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authMiddleware([UserRole.ADMIN]), handleGetCashierDetail);

export default router;
