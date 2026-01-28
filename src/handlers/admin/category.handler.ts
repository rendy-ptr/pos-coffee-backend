import type { Response } from 'express';
import type { AuthRequest } from '@/types/auth';
import type { ApiResponse } from '@/types/ApiResponse';
import { categoryService } from '@/services/category.service';
import { NotFoundError, BusinessError } from '@/utils/errors';
import { assertHasUser } from '@/utils/assert';
import type { Category } from '@prisma/client';

export const handleGetCategories = async (
  req: AuthRequest,
  res: Response<ApiResponse<Category[]>>
) => {
  try {
    assertHasUser(req);
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${categories.length} kategori`,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const handleCreateCategory = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    assertHasUser(req);
    const category = await categoryService.createCategory(
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: `Kategori ${category.name} berhasil dibuat`,
      data: null,
    });
  } catch (error) {
    if (error instanceof BusinessError) {
      res.status(400).json({
        success: false,
        message: error.message,
        errorCode: 'BUSINESS_ERROR',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const handleUpdateCategory = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    assertHasUser(req);
    const { id } = req.params;

    const category = await categoryService.updateCategory(id, req.body);

    res.status(200).json({
      success: true,
      message: `Kategori ${category.name} berhasil diperbarui`,
      data: null,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        errorCode: 'NOT_FOUND',
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(400).json({
        success: false,
        message: error.message,
        errorCode: 'BUSINESS_ERROR',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const handleDeleteCategory = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    assertHasUser(req);
    const { id } = req.params;
    const category = await categoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: `Kategori ${category.name} berhasil dihapus`,
      data: null,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        errorCode: 'NOT_FOUND',
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(400).json({
        success: false,
        message: error.message,
        errorCode: 'BUSINESS_ERROR',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat hapus kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
