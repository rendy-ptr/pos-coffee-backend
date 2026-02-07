import type { Request, Response } from 'express';
import { menuService } from '@/services/admin/menu.service';
import type { ApiRes } from '@/types/response/api.type';
import type { IdParams } from '@/types/request/params.type';
import { BusinessError, NotFoundError } from '@/utils/errors';
import {
  menuDetailResponse,
  menuListResponse,
  menuMutateResponse,
} from '@/queries/menu.query';
import { CreateMenuDTO, UpdateMenuDTO } from '@/schemas/menu.schema';

export const handleGetMenus = async (
  req: Request,
  res: Response<ApiRes<menuListResponse[]>>
) => {
  try {
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
      data: null,
    });
  }
};

export const handleCreateMenu = async (
  req: Request<{}, {}, CreateMenuDTO>,
  res: Response<ApiRes<menuMutateResponse>>
) => {
  try {
    const body = req.body;
    const menu = await menuService.createMenu(body);

    res.status(200).json({
      success: true,
      message: `Menu ${menu.name} berhasil dibuat`,
      data: menu,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(409).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Membuat Menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleUpdateMenu = async (
  req: Request<IdParams, {}, UpdateMenuDTO>,
  res: Response<ApiRes<menuMutateResponse>>
) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const menu = await menuService.updateMenu(id, body);

    res.status(200).json({
      success: true,
      message: `Menu ${menu.name} berhasil diperbarui`,
      data: menu,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(409).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengedit menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleDeleteMenu = async (
  req: Request<IdParams>,
  res: Response<ApiRes<null>>
) => {
  try {
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
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleGetMenuDetail = async (
  req: Request<IdParams>,
  res: Response<ApiRes<menuDetailResponse>>
) => {
  try {
    const { id } = req.params;
    const menu = await menuService.getMenuDetail(id);

    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan menu ${menu.name}`,
      data: menu,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(409).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Mengambil Menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};
