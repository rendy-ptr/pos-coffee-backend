import type { Response } from 'express';
import { baseLogger } from '../../middlewares/logger';
import type { AuthRequest } from '../../types/auth';
import { prisma } from '@/utils/prisma';
import type { Category } from '@prisma/client';
import type { ApiResponse } from '@/types/ApiResponse';
import {
  createCategorySchema,
  updateCategorySchema,
} from '@/schemas/category.schema';

export const createCategory = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User admin tidak ditemukan pada request',
      });
      return;
    }

    const parsed = createCategorySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: parsed.error.issues,
      });
      return;
    }
    const payload = parsed.data;

    const existingCategory = await prisma.category.findUnique({
      where: { name: payload.name },
    });

    if (existingCategory) {
      res.status(400).json({
        success: false,
        message: 'Kategori dengan nama tersebut sudah ada',
      });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name: payload.name,
        description: payload.description,
        icon: payload.icon,
        isActive: payload.isActive,
        createdById: user.id,
      },
    });

    baseLogger.info(`Kategori dibuat: ${category.name} oleh ${user.role}`);
    res.status(201).json({
      success: true,
      message: `Kategori ${category.name} berhasil dibuat`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Membuat Kategori', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat Kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getCategories = async (
  req: AuthRequest,
  res: Response<ApiResponse<Category[]>>
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User Admin tidak ditemukan pada request',
      });
      return;
    }
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${categories.length} Kategori`,
      data: categories,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengambil Kategori', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil Kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const editCategory = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User Admin tidak ditemukan pada request',
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'ID kategori wajib',
      });
      return;
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
      });
      return;
    }

    const parsed = updateCategorySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: parsed.error.issues,
      });
      return;
    }
    const payload = parsed.data;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...payload,
      },
    });

    baseLogger.info(`Kategori di update: ${updatedCategory.name}`);

    res.status(200).json({
      success: true,
      message: `Kategori ${updatedCategory.name} berhasil diperbarui`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Update Kategori', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update Kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteCategory = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User Admin tidak ditemukan pada request',
      });
      return;
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
      });
      return;
    }

    const relatedMenus = await prisma.menu.findMany({
      where: { categoryId: id },
    });
    if (relatedMenus.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Kategori masih digunakan oleh menu, tidak bisa dihapus',
      });
      return;
    }

    await prisma.category.delete({ where: { id } });

    baseLogger.info(`Kategori dihapus: ${category.name}`);
    res.status(200).json({
      success: true,
      message: `Kategori ${category.name} berhasil dihapus`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Hapus Kategori', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat hapus Kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
