import express from 'express';
import {
  createCategory,
  getCategories,
  editCategory,
  deleteCategory,
} from '@/controllers/admin/category.controller';
import {
  createMenu,
  getMenus,
  editMenu,
  deleteMenu,
} from '@/controllers/admin/menu.controller';
import { authMiddleware } from '@middlewares/auth';
import { UserRole } from '@prisma/client';
import {
  createKasir,
  deleteKasir,
  editKasir,
  getKasir,
  refreshKasirId,
} from '@/controllers/admin/kasir.controller';
import {
  createTable,
  deleteTable,
  editTable,
  getTables,
} from '@/controllers/admin/table.controller';

const adminRouter = express.Router();

// Kategori Routes
adminRouter.post('/kategori', authMiddleware([UserRole.ADMIN]), createCategory);
adminRouter.get('/kategori', authMiddleware([UserRole.ADMIN]), getCategories);
adminRouter.patch(
  '/kategori/:id',
  authMiddleware([UserRole.ADMIN]),
  editCategory
);
adminRouter.delete(
  '/kategori/:id',
  authMiddleware([UserRole.ADMIN]),
  deleteCategory
);

// Menu Routes
adminRouter.post('/menu', authMiddleware([UserRole.ADMIN]), createMenu);
adminRouter.get('/menu', authMiddleware([UserRole.ADMIN]), getMenus);
adminRouter.patch('/menu/:id', authMiddleware([UserRole.ADMIN]), editMenu);
adminRouter.delete('/menu/:id', authMiddleware([UserRole.ADMIN]), deleteMenu);

// Kasir Routes
adminRouter.post('/kasir', authMiddleware([UserRole.ADMIN]), createKasir);
adminRouter.get('/kasir', authMiddleware([UserRole.ADMIN]), getKasir);
adminRouter.patch('/kasir/:id', authMiddleware([UserRole.ADMIN]), editKasir);
adminRouter.delete('/kasir/:id', authMiddleware([UserRole.ADMIN]), deleteKasir);
adminRouter.get('/kasir/:id', authMiddleware([UserRole.ADMIN]), refreshKasirId);

// Table Routes
adminRouter.post('/table', authMiddleware([UserRole.ADMIN]), createTable);
adminRouter.get('/table', authMiddleware([UserRole.ADMIN]), getTables);
adminRouter.patch('/table/:id', authMiddleware([UserRole.ADMIN]), editTable);
adminRouter.delete('/table/:id', authMiddleware([UserRole.ADMIN]), deleteTable);

export default adminRouter;
