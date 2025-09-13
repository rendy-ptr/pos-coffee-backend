import type { Request, Response } from 'express';
import { hashPassword, comparePassword } from '@/utils/hash';
import jwt from 'jsonwebtoken';
import { baseLogger } from '@/middlewares/logger';
import { prisma } from '@/utils/prisma';

import { Prisma } from '@prisma/client';
import { registerSchema, loginSchema } from '../../schemas/register.schema';
import type { JwtPayload, AuthRequest } from '../../types/auth';
import { ApiResponse } from '@/types/ApiResponse';

export const registerCustomer = async (
  req: Request,
  res: Response<
    ApiResponse<{
      id: string;
      name: string;
      email: string;
      role: string;
      redirectUrl: string;
    }>
  >
) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
      errorCode: 'INVALID_INPUT',
    });
    return;
  }
  const { name, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email Telah Terdaftar',
        errorCode: 'EMAIL_TAKEN',
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    // Create user dan customer profile dalam transaksi
    const newCustomer = await prisma.$transaction(async tx => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      await tx.customerProfile.create({
        data: {
          userId: user.id,
          loyaltyPoints: 10,
        },
      });

      return user;
    });

    baseLogger.info(`Registrasi Berhasil | customer-id: ${newCustomer.id}`);

    res.status(201).json({
      success: true,
      message: 'Registrasi Berhasil',
      data: {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        role: newCustomer.role,
        redirectUrl: '/auth/login',
      },
    });
  } catch (error) {
    baseLogger.error('Error during registration', {
      email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(400).json({
        success: false,
        message: 'Email sudah digunakan',
        errorCode: 'EMAIL_TAKEN',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? String(error)
          : 'Terjadi kesalahan server',
      errorCode: 'SERVER_ERROR',
    });
  }
};

export const loginAuth = async (
  req: Request,
  res: Response<
    ApiResponse<{ id: string; name: string; role: string; redirectUrl: string }>
  >
) => {
  // Validate request body
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
      errorCode: 'INVALID_INPUT',
    });
    return;
  }
  const { email, password } = result.data;

  // Validate JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    baseLogger.error('JWT Tidak Terdeteksi');
    res.status(500).json({
      success: false,
      message: 'Konfigurasi Server Salah',
      errorCode: 'JWT_CONFIG_ERROR',
    });
    return;
  }

  try {
    // Check Login
    const user = await prisma.user.findFirst({
      where: {
        email,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Email Tidak Terdaftar',
        errorCode: 'INVALID_CREDENTIALS',
      });
      return;
    }

    // Check Password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Email Atau Password Salah',
        errorCode: 'INVALID_CREDENTIALS',
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      } as JwtPayload,
      jwtSecret,
      { expiresIn: '1h', algorithm: 'HS256' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 1000,
    });

    // Log success
    baseLogger.info(`Login Berhasil | user-id: ${user.id}`);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login Berhasil',
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        redirectUrl: `/dashboard/${user.role.toLowerCase()}`,
      },
    });
  } catch (error) {
    baseLogger.error('Error during login', {
      email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? String(error)
          : 'Terjadi kesalahan server',
      errorCode: 'SERVER_ERROR',
    });
  }
};

export const logoutAuth = async (
  req: Request,
  res: Response<ApiResponse<null>>
) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    success: true,
    message: 'Logout berhasil',
    data: null,
  });
};

export const authMe = async (
  req: AuthRequest,
  res: Response<ApiResponse<{ id: string; email: string; role: string }>>
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Tidak ter-autentikasi',
    });
    return;
  }
  baseLogger.info(`Ter-Autentikasi User ID: ${req.user.id}`);
  res.json({
    success: true,
    message: 'User ter-autentikasi',
    data: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
