import type { Request, Response } from 'express';
import { categoryService } from '@/services/category.service';
import type { ApiRes } from '@/types/response/api.type';
import type { IdParams } from '@/types/request/params.type';
import { NotFoundError, BusinessError } from '@/utils/errors';
import type { Category } from '@prisma/client';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '@/schemas/category.schema';

export const handleGetCategories = async (
  req: Request,
  res: Response<ApiRes<Category[]>>
) => {
  try {
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
      data: null,
    });
  }
};

export const handleCreateCategory = async (
  req: Request<{}, {}, CreateCategoryDTO>,
  res: Response<ApiRes<null>>
) => {
  try {
    const body = req.body;
    const category = await categoryService.createCategory(body);

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
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleUpdateCategory = async (
  req: Request<IdParams, {}, UpdateCategoryDTO>,
  res: Response<ApiRes<null>>
) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const category = await categoryService.updateCategory(id, body);

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
        data: null,
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(400).json({
        success: false,
        message: error.message,
        errorCode: 'BUSINESS_ERROR',
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleDeleteCategory = async (
  req: Request<IdParams>,
  res: Response<ApiRes<null>>
) => {
  try {
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
        data: null,
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(400).json({
        success: false,
        message: error.message,
        errorCode: 'BUSINESS_ERROR',
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat hapus kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};
