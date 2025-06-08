import express from 'express';
import { getMenus } from '../../controllers/menu.controller.ts';

const router = express.Router();

router.get('/', getMenus);

export default router;
