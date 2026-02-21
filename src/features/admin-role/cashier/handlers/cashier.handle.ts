import type { Request, Response } from 'express';
import { cashierService } from '@/features/admin-role/cashier/services/cashier.service';
import type { ApiRes } from '@/types/api.type';
import type { IdParams } from '@/types/params.type';
import { NotFoundError, BusinessError } from '@/utils/errors';
import {
  CashierListResponse,
  CashierDetailResponse,
  CashierMutateResponse,
} from '@/features/admin-role/cashier/queries/cashier.query';
import {
  CreateCashierDTO,
  UpdateCashierDTO,
} from '@/features/admin-role/cashier/schemas/cashier.schema';

export const handleGetAllCashiers = async (
  req: Request,
  res: Response<ApiRes<CashierListResponse[]>>
) => {
  try {
    const cashiers = await cashierService.getAllCashier();
    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${cashiers.length} cashiers`,
      data: cashiers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil cashier',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleCreateCashier = async (
  req: Request<{}, {}, CreateCashierDTO>,
  res: Response<ApiRes<CashierMutateResponse>>
) => {
  try {
    const body = req.body;
    const cashier = await cashierService.createCashier(body);

    res.status(200).json({
      success: true,
      message: `Cashier ${cashier.name} berhasil dibuat`,
      data: cashier,
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
      message: 'Terjadi kesalahan saat membuat cashier',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleUpdateCashier = async (
  req: Request<IdParams, {}, UpdateCashierDTO>,
  res: Response<ApiRes<CashierMutateResponse>>
) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const cashier = await cashierService.updateCashier(id, body);

    res.status(200).json({
      success: true,
      message: `Cashier ${cashier.name} berhasil diperbarui`,
      data: cashier,
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
      message: 'Terjadi kesalahan saat update cashier',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleDeleteCashier = async (
  req: Request<IdParams>,
  res: Response<ApiRes<null>>
) => {
  try {
    const { id } = req.params;
    const cashier = await cashierService.deleteCashier(id);

    res.status(200).json({
      success: true,
      message: `Cashier ${cashier.name} berhasil dihapus`,
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
      message: 'Terjadi kesalahan saat menghapus cashier',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleGetCashierDetail = async (
  req: Request<IdParams>,
  res: Response<ApiRes<CashierDetailResponse>>
) => {
  try {
    const { id } = req.params;
    const cashier = await cashierService.getCashierDetail(id);

    res.status(200).json({
      success: true,
      message: `Cashier ${cashier.name} berhasil ditemukan`,
      data: cashier,
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
      message: 'Terjadi kesalahan saat mengambil cashier',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};
