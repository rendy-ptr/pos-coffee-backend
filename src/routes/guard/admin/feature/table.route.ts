import express from 'express';
import {
  createTable,
  deleteTable,
  editTable,
  getTables,
} from '@/controllers/admin/table.controller';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/', authMiddleware([UserRole.ADMIN]), createTable);
router.get('/', authMiddleware([UserRole.ADMIN]), getTables);
router.patch('/:id', authMiddleware([UserRole.ADMIN]), editTable);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), deleteTable);

export default router;
