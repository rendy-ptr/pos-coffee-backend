import express from 'express';
import {
  createKasir,
  deleteKasir,
  editKasir,
  getKasir,
  refreshKasirId,
} from '@/controllers/admin/kasir.controller';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/', authMiddleware([UserRole.ADMIN]), createKasir);
router.get('/', authMiddleware([UserRole.ADMIN]), getKasir);
router.patch('/:id', authMiddleware([UserRole.ADMIN]), editKasir);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), deleteKasir);
router.get('/:id', authMiddleware([UserRole.ADMIN]), refreshKasirId);

export default router;
