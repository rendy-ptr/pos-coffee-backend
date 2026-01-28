import type { Response } from 'express';
import { menuService } from '@/services/menu.service';
import type { AuthRequest } from '@/types/auth';
import type { ApiResponse } from '@/types/ApiResponse';
import { BusinessError, NotFoundError } from '@/utils/errors';
import { assertHasUser } from '@/utils/assert';
import { MenuWithCategory } from '@/data/menu.data';

export const handleGetMenus = async (
  req: AuthRequest,
  res: Response<ApiResponse<MenuWithCategory[]>>
) => {
  try {
    assertHasUser(req);
    const menus = await menuService.getAllMenus();

    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${menus.length} Menu`,
      data: menus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Mengambil Menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const handleCreateMenu = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    assertHasUser(req);
    const menu = await menuService.createMenu(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: `Menu ${menu.name} berhasil dibuat`,
      data: null,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Membuat Menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const handleUpdateMenu = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    assertHasUser(req);
    const { id } = req.params;
    const menu = await menuService.updateMenu(id, req.body);

    res.status(200).json({
      success: true,
      message: `Menu ${menu.name} berhasil diperbarui`,
      data: null,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengedit menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const handleDeleteMenu = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    assertHasUser(req);
    const { id } = req.params;
    const menu = await menuService.deleteMenu(id);

    res.status(200).json({
      success: true,
      message: `Menu ${menu.name} berhasil dihapus`,
      data: null,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
