import { Response } from 'express';
import { AuthRequest } from '@/types/auth';
import { prisma } from '@/utils/prisma';
import { baseLogger } from '@/middlewares/logger';
import { createMenuSchema, editMenuSchema } from '@/schemas/menu.schema';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Prisma } from '@prisma/client';

type MenuWithCategory = Prisma.MenuGetPayload<{
  include: { category: true };
}>;

export const createMenu = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
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

    const parsed = createMenuSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: parsed.error.issues,
      });
      return;
    }
    const payload = parsed.data;

    const existingMenu = await prisma.menu.findUnique({
      where: { name: payload.name },
    });

    if (existingMenu) {
      res.status(409).json({
        success: false,
        message: 'Menu dengan nama tersebut sudah ada',
      });
      return;
    }

    const menu = await prisma.menu.create({
      data: {
        ...payload,
        createdById: user.id,
      },
    });

    baseLogger.info(`Menu dibuat: ${menu.name} oleh ${user.role}`);
    res.status(201).json({
      success: true,
      message: `Menu ${menu.name} berhasil dibuat`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Membuat Menu', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Membuat Reward',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getMenus = async (
  req: AuthRequest,
  res: Response<ApiResponse<MenuWithCategory[]>>
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

    const menus = await prisma.menu.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${menus.length} Menu`,
      data: menus,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengambil Menu', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Mengambil Menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const editMenu = async (
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
        message: 'ID menu wajib',
      });
      return;
    }

    const existingMenu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!existingMenu) {
      res.status(404).json({
        success: false,
        message: 'Menu tidak ditemukan',
      });
      return;
    }

    const parsed = editMenuSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: parsed.error.issues,
      });
      return;
    }

    const payload = parsed.data;

    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: {
        ...payload,
      },
    });

    baseLogger.info(`Menu di update: ${updatedMenu.name}`);

    res.status(200).json({
      success: true,
      message: `Menu ${updatedMenu.name} berhasil diperbarui`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengedit Menu', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengedit menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteMenu = async (
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

    const menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) {
      res.status(404).json({
        success: false,
        message: 'Menu tidak ditemukan',
      });
      return;
    }

    await prisma.menu.delete({ where: { id } });

    baseLogger.info(`Menu dihapus: ${menu.name}`);

    res.status(200).json({
      success: true,
      message: `Menu ${menu.name} berhasil dihapus`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Menghapus Menu', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
