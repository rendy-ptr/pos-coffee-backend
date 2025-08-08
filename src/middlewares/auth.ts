import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { baseLogger } from './logger';
import { AuthRequest, JwtPayload } from '../types/auth';
import { UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export const authMiddleware = (allowedRoles: UserRole[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.cookies.token;

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

      // Type guard untuk memastikan decoded adalah JwtPayload
      if (
        typeof decoded === 'string' ||
        !decoded.id ||
        !decoded.email ||
        !decoded.role
      ) {
        baseLogger.warn('Akses ditolak: Token tidak valid atau tidak lengkap');
        res.status(401).json({
          success: false,
          message: 'Token tidak valid',
          errorCode: 'INVALID_TOKEN',
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        baseLogger.warn(
          `Akses ditolak: Pengguna tidak ditemukan atau tidak aktif - ID: ${decoded.id}`
        );
        res.status(401).json({
          success: false,
          message: 'Pengguna tidak valid atau tidak aktif',
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

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      baseLogger.info(
        `Autentikasi berhasil | user-id: ${user.id}, role: ${user.role}, email: ${user.email}`
      );
      next();
    } catch (error) {
      baseLogger.error('Error selama autentikasi', {
        token: token.slice(0, 10) + '...', // Jangan log seluruh token
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
