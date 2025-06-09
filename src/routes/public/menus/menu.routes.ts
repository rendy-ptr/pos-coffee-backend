import express from 'express';
import { getMenus } from '@/controllers/menu.controller';

const router = express.Router();

router.get('/', getMenus);

export default router;
