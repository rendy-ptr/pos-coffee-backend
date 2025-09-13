import { Response, Request } from 'express';
import { AuthRequest } from '@/types/auth';
import { hashPassword } from '../../utils/hash';
import { baseLogger } from '@/middlewares/logger';
import { prisma } from '@/utils/prisma';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Prisma } from '@prisma/client';
import { CreateKasirSchema } from '@/schemas/kasir.schema';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

type KasirWithProfile = Prisma.UserGetPayload<{
  include: { kasirProfile: true };
}>;

export const createKasir = async (
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

    const parsed = CreateKasirSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: parsed.error.issues,
      });
      return;
    }

    const payload = parsed.data;

    const existingKasir = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingKasir) {
      res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
      });
      return;
    }

    const plainPassword = crypto.randomBytes(6).toString('base64');

    const hashed = await hashPassword(plainPassword);

    const newKasir = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashed,
        role: 'KASIR',
        phone: payload.phone,
        profilePicture: payload.profilePicture ?? undefined,
        isActive: payload.isActive,
        kasirProfile: {
          create: {
            shiftStart: payload.shiftStart,
            shiftEnd: payload.shiftEnd,
          },
        },
      },
      include: {
        kasirProfile: true,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: payload.email,
      subject: 'Akun Kasir Baru',
      text: `Halo ${payload.name},

Akun kasir Anda telah dibuat oleh Admin.

Email: ${payload.email}
Password: ${plainPassword}

Silakan login dan segera ganti password Anda.`,
    });

    baseLogger.info(
      `Kasir dibuat: ${newKasir.name} oleh ${user.role} dengan email ${user.email}`
    );
    res.status(201).json({
      success: true,
      message: `Kasir ${newKasir.name} berhasil dibuat dan password dikirim ke email`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Membuat Kasir', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kasir',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getKasir = async (
  req: Request,
  res: Response<ApiResponse<KasirWithProfile[]>>
) => {
  try {
    const kasirs = await prisma.user.findMany({
      where: { role: 'KASIR' },
      include: { kasirProfile: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      message: `Berhasil mendapatkan ${kasirs.length} Kasir`,
      data: kasirs,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Membuat Kasir', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kasir',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// export const editKasir = async (
//   req: AuthRequest,
//   res: Response<ApiResponse<null>>
// ) => {
//   try {
//     const { id } = req.params;
//     const user = req.user;
//     if (!user) {
//       res.status(401).json({
//         success: false,
//         message: 'User Admin tidak ditemukan pada request',
//       });
//       return;
//     }

//     if (!id) {
//       res.status(400).json({
//         success: false,
//         message: 'ID kasir wajib ada',
//       });
//       return;
//     }

//     const existingKasir = await prisma.user.findUnique({
//       where: { id },
//     });

//     if (!existingKasir) {
//       res.status(404).json({
//         success: false,
//         message: 'Kasir tidak ditemukan',
//       });
//       return;
//     }

//     const parsed = editKasirSchema.safeParse(req.body);

//     if (!parsed.success) {
//       res.status(400).json({
//         success: false,
//         message: 'Validasi gagal',
//         errors: parsed.error.issues,
//       });
//       return;
//     }

//     const payload = parsed.data;

//     // handle password
//     let finalPasswordHash = existingKasir.password;
//     if (
//       payload.password &&
//       payload.password.trim() !== '' &&
//       !(await comparePassword(payload.password, existingKasir.password))
//     ) {
//       finalPasswordHash = await hashPassword(payload.password);
//     }

//     const updatedKasir = await prisma.user.update({
//       where: { id },
//       data: {
//         name: payload.name,
//         email: payload.email,
//         phone: payload.phone,
//         isActive: payload.isActive,
//         password: finalPasswordHash,
//         profilePicture: payload.profilePicture,
//         kasirProfile: {
//           update: {
//             shiftStart: payload.shiftStart,
//             shiftEnd: payload.shiftEnd,
//           },
//         },
//       },
//     });

//     baseLogger.info(`Kasir di update: ${updatedKasir.name}`);

//     res.status(200).json({
//       success: true,
//       message: `Kasir ${updatedKasir.name} berhasil diperbarui`,
//       data: null,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       baseLogger.error('Error Mengedit Kasir', {
//         error: error.message,
//         stack: error.stack,
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Terjadi kesalahan saat mengedit kasir',
//       errorCode: 'SERVER_ERROR',
//       error: error instanceof Error ? error.message : String(error),
//     });
//   }
// };

export const deleteKasir = async (
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
    const kasir = await prisma.user.findUnique({ where: { id } });
    if (!kasir) {
      res.status(404).json({
        success: false,
        message: 'Kasir tidak ditemukan',
      });
      return;
    }
    await prisma.user.delete({ where: { id } });
    baseLogger.info(
      `Kasir dihapus: ${kasir.name} oleh ${user.role} dengan email ${user.email}`
    );
    res.status(200).json({
      success: true,
      message: `Kasir ${kasir.name} berhasil dihapus`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Menghapus Kasir', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kasir',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const refreshKasirId = async (
  req: AuthRequest,
  res: Response<ApiResponse<KasirWithProfile>>
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
        message: 'ID kasir wajib ada',
      });
      return;
    }

    const kasir = await prisma.user.findFirst({
      where: { id, role: 'KASIR' },
      include: { kasirProfile: true },
    });

    if (!kasir) {
      res.status(404).json({
        success: false,
        message: 'Kasir tidak ditemukan',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Kasir ${kasir.name} berhasil di-refresh`,
      data: kasir,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Refresh Kasir', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat me-refresh kasir',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
