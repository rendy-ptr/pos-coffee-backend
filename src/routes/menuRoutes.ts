import express from 'express';
import { getMenus } from '../controllers/menuController.ts';

const router = express.Router();

router.get('/', getMenus);

export default router;
