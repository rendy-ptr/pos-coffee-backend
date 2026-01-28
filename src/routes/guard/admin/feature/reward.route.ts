import express from 'express';
import {
  createReward,
  deleteReward,
  editReward,
  getRewards,
} from '@/controllers/admin/reward.controller';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/', authMiddleware([UserRole.ADMIN]), createReward);
router.get('/', authMiddleware([UserRole.ADMIN]), getRewards);
router.patch('/:id', authMiddleware([UserRole.ADMIN]), editReward);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), deleteReward);

export default router;
