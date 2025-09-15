import { baseLogger } from '@/middlewares/logger';
import {
  createTableSchema,
  tableParamsSchema,
  updateTableSchema,
} from '@/schemas/table.schema';
import { ApiResponse } from '@/types/ApiResponse';
import { AuthRequest } from '@/types/auth';
import { prisma } from '@/utils/prisma';
import { Response } from 'express';
import { Table } from '@prisma/client';

export const createTable = async (
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

    const parsed = createTableSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: parsed.error.issues,
      });
      return;
    }

    const payload = parsed.data;

    const existingTable = await prisma.table.findUnique({
      where: { number: payload.number },
    });

    if (existingTable) {
      res.status(409).json({
        success: false,
        message: 'Meja dengan nomor tersebut sudah ada',
      });
      return;
    }

    const table = await prisma.table.create({
      data: {
        ...payload,
        createdById: user.id,
      },
    });

    baseLogger.info(`Meja dibuat: ${table.number} oleh ${user.role}`);
    res.status(201).json({
      success: true,
      message: 'Meja berhasil dibuat',
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Membuat Meja', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat meja',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getTables = async (
  req: AuthRequest,
  res: Response<ApiResponse<Table[]>>
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

    const tables = await prisma.table.findMany({
      orderBy: { number: 'desc' },
    });

    res.status(200).json({
      success: true,
      message: 'Daftar meja berhasil diambil',
      data: tables,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengambil Daftar Meja', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil daftar meja',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const editTable = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    const paramsValidation = tableParamsSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      res.status(400).json({
        success: false,
        message: 'Parameter ID tidak valid',
        errors: paramsValidation.error.issues,
      });
      return;
    }

    const { id } = paramsValidation.data;
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User Admin tidak ditemukan pada request',
      });
      return;
    }

    // Check existing table
    const existingTable = await prisma.table.findUnique({
      where: { id },
    });

    if (!existingTable) {
      res.status(404).json({
        success: false,
        message: 'Meja tidak ditemukan',
      });
      return;
    }

    // Validasi request body
    const bodyValidation = updateTableSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi data gagal',
        errors: bodyValidation.error.issues,
      });
      return;
    }

    const payload = bodyValidation.data;

    // Additional business logic validation
    if (payload.number && payload.number !== existingTable.number) {
      const numberExists = await prisma.table.findFirst({
        where: {
          number: payload.number,
          id: { not: id },
        },
      });

      if (numberExists) {
        res.status(409).json({
          success: false,
          message: `Nomor meja ${payload.number} sudah digunakan`,
        });
        return;
      }
    }

    // Validate currentGuests doesn't exceed capacity
    const finalCapacity = payload.capacity ?? existingTable.capacity;
    if (
      payload.currentGuests !== undefined &&
      payload.currentGuests > finalCapacity
    ) {
      res.status(400).json({
        success: false,
        message: `Jumlah tamu (${payload.currentGuests}) tidak boleh melebihi kapasitas (${finalCapacity})`,
      });
      return;
    }

    // Update table
    const updatedTable = await prisma.table.update({
      where: { id },
      data: {
        ...payload,
      },
    });

    baseLogger.info(`Meja diupdate: ${updatedTable.number} oleh ${user.role}`);

    res.status(200).json({
      success: true,
      message: `Meja ${updatedTable.number} berhasil diperbarui`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Update Meja', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update Meja',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteTable = async (
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
    const table = await prisma.table.findUnique({ where: { id } });
    if (!table) {
      res.status(404).json({
        success: false,
        message: 'Meja tidak ditemukan',
      });
      return;
    }
    await prisma.table.delete({ where: { id } });
    baseLogger.info(
      `Meja dihapus: ${table.number} oleh ${user.role} dengan email ${user.email}`
    );
    res.status(200).json({
      success: true,
      message: `Meja ${table.number} berhasil dihapus`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Menghapus Meja', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus meja',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
