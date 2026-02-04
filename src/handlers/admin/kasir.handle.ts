import type { Request, Response } from 'express';
import { kasirService } from '@/services/kasir.service';
import type { ApiRes } from '@/types/response/api.type';
import type { IdParams } from '@/types/request/params.type';
import { NotFoundError, BusinessError } from '@/utils/errors';
import {
  KasirListResponse,
  KasirDetailResponse,
  kasirMutateResponse,
} from '@/queries/kasir.query';
import { CreateKasirDTO, UpdateKasirDTO } from '@/schemas/kasir.schema';

export const handleGetKasir = async (
  req: Request,
  res: Response<ApiRes<KasirListResponse[]>>
) => {
  try {
    const kasir = await kasirService.getAllKasir();
    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${kasir.length} Kasir`,
      data: kasir,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Mengambil Kasir',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleCreateKasir = async (
  req: Request<{}, {}, CreateKasirDTO>,
  res: Response<ApiRes<kasirMutateResponse>>
) => {
  try {
    const body = req.body;
    const kasir = await kasirService.createKasir(body);

    res.status(200).json({
      success: true,
      message: `Kasir ${kasir.name} berhasil dibuat`,
      data: kasir,
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
      message: 'Terjadi kesalahan saat Membuat Kasir',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleUpdateKasir = async (
  req: Request<IdParams, {}, UpdateKasirDTO>,
  res: Response<ApiRes<kasirMutateResponse>>
) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const kasir = await kasirService.updateKasir(id, body);

    res.status(200).json({
      success: true,
      message: `Kasir ${kasir.name} berhasil diperbarui`,
      data: kasir,
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
      message: 'Terjadi kesalahan saat Update Kasir',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleDeleteKasir = async (
  req: Request<IdParams>,
  res: Response<ApiRes<null>>
) => {
  try {
    const { id } = req.params;
    const kasir = await kasirService.deleteKasir(id);

    res.status(200).json({
      success: true,
      message: `Kasir ${kasir.name} berhasil dihapus`,
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
      message: 'Terjadi kesalahan saat Delete Kasir',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleGetKasirDetail = async (
  req: Request<IdParams>,
  res: Response<ApiRes<KasirDetailResponse>>
) => {
  try {
    const { id } = req.params;
    const kasir = await kasirService.getKasirDetail(id);

    res.status(200).json({
      success: true,
      message: `Kasir ${kasir.name} berhasil ditemukan`,
      data: kasir,
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
      message: 'Terjadi kesalahan saat Get Kasir',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};
