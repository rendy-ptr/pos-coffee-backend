import { Router } from 'express';
import {
  getPublicCategories,
  getPublicMenus,
} from '@/controllers/public/menu/menu.controller';

const menuRouter = Router();

// route publik tanpa auth
menuRouter.get('/', getPublicMenus);
menuRouter.get('/kategori', getPublicCategories);

export default menuRouter;
