import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { baseLogger } from '../middlewares/logger';
import type { UserRole } from '@prisma/client';
import { AuthRequest } from '../types/auth';
import { JwtPayload } from '../types/express';

const prisma = new PrismaClient();

export const authMiddleware = (allowedRoles: UserRole[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      baseLogger.warn('Akses ditolak: Token tidak ditemukan');
      res.status(401).json({
        success: false,
        message: 'Token diperlukan',
        errorCode: 'NO_TOKEN',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      baseLogger.error('JWT_SECRET tidak terdeteksi');
      res.status(500).json({
        success: false,
        message: 'Konfigurasi server salah',
        errorCode: 'JWT_CONFIG_ERROR',
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
          isDeleted: false,
        },
        include: {
          customerProfile: true,
          kasirProfile: true,
          adminProfile: true,
        },
      });

      if (!user) {
        baseLogger.warn(
          `Akses ditolak: Pengguna tidak ditemukan atau dihapus - ID: ${decoded.id}`
        );
        res.status(401).json({
          success: false,
          message: 'Pengguna tidak valid',
          errorCode: 'INVALID_USER',
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        baseLogger.warn(
          `Akses ditolak: Role tidak diizinkan - ${user.role}, ID: ${decoded.id}`
        );
        res.status(403).json({
          success: false,
          message: 'Akses ditolak',
          errorCode: 'FORBIDDEN',
        });
        return;
      }

      if (user.role === 'CUSTOMER' && !user.customerProfile) {
        baseLogger.warn(
          `Akses ditolak: Profil pelanggan tidak ditemukan - ID: ${decoded.id}`
        );
        res.status(403).json({
          success: false,
          message: 'Profil pelanggan tidak valid',
          errorCode: 'INVALID_PROFILE',
        });
        return;
      }
      if (user.role === 'KASIR' && !user.kasirProfile) {
        baseLogger.warn(
          `Akses ditolak: Profil kasir tidak ditemukan - ID: ${decoded.id}`
        );
        res.status(403).json({
          success: false,
          message: 'Profil kasir tidak valid',
          errorCode: 'INVALID_PROFILE',
        });
        return;
      }
      if (user.role === 'ADMIN' && !user.adminProfile) {
        baseLogger.warn(
          `Akses ditolak: Profil admin tidak ditemukan - ID: ${decoded.id}`
        );
        res.status(403).json({
          success: false,
          message: 'Profil admin tidak valid',
          errorCode: 'INVALID_PROFILE',
        });
        return;
      }

      req.user = {
        id: user.id,
      };

      baseLogger.info(
        `Autentikasi berhasil | user-id: ${user.id}, role: ${user.role}`
      );
      next();
    } catch (error) {
      baseLogger.error('Error selama autentikasi', {
        token,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      res.status(401).json({
        success: false,
        message:
          process.env.NODE_ENV === 'development'
            ? String(error)
            : 'Token tidak valid',
        errorCode: 'INVALID_TOKEN',
      });
    }
  };
};
