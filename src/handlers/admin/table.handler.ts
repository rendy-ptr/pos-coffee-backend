import type { Request, Response } from 'express';
import { tableService } from '@/services/admin/table.service';
import type { ApiRes } from '@/types/response/api.type';
import type { IdParams } from '@/types/request/params.type';
import { NotFoundError, BusinessError } from '@/utils/errors';
import { CreateTableDTO, UpdateTableDTO } from '@/schemas/table.schema';
import type { Table } from '@prisma/client';

export const handleGetTable = async (
  req: Request,
  res: Response<ApiRes<Table[]>>
) => {
  try {
    const table = await tableService.getAllTable();
    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${table.length} Meja`,
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Mengambil Meja',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleCreateTable = async (
  req: Request<{}, {}, CreateTableDTO>,
  res: Response<ApiRes<Table>>
) => {
  try {
    const body = req.body;
    const table = await tableService.createTable(body);

    res.status(200).json({
      success: true,
      message: `Meja ${table.number} berhasil dibuat`,
      data: table,
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
      message: 'Terjadi kesalahan saat Membuat Meja',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleUpdateTable = async (
  req: Request<IdParams, {}, UpdateTableDTO>,
  res: Response<ApiRes<Table>>
) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const table = await tableService.updateTable(id, body);

    res.status(200).json({
      success: true,
      message: `Meja ${table.number} berhasil diperbarui`,
      data: table,
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
      message: 'Terjadi kesalahan saat Update Meja',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleDeleteTable = async (
  req: Request<IdParams>,
  res: Response<ApiRes<null>>
) => {
  try {
    const { id } = req.params;
    const table = await tableService.deleteTable(id);

    res.status(200).json({
      success: true,
      message: `Meja ${table.number} berhasil dihapus`,
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
      message: 'Terjadi kesalahan saat Delete Meja',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};
