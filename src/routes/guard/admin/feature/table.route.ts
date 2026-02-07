import express from 'express';
import { handleCreateTable, handleDeleteTable, handleGetTable, handleUpdateTable } from '@/handlers/admin/table.handler';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/', authMiddleware([UserRole.ADMIN]), handleCreateTable);
router.get('/', authMiddleware([UserRole.ADMIN]), handleGetTable);
router.patch('/:id', authMiddleware([UserRole.ADMIN]), handleUpdateTable);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), handleDeleteTable);

export default router;
