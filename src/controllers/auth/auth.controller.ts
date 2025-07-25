import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '@/utils/hash';
import jwt from 'jsonwebtoken';
import { baseLogger } from '@/middlewares/logger';

import { registerSchema, loginSchema } from '../../config/zodSchemas';
import type { UserRole } from '@prisma/client';
import { JwtPayload } from '@/types/express';

const prisma = new PrismaClient();

export const registerCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  //  Validate Request Body
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({ success: false, message: result.error.issues[0].message });
    return;
  }
  const { name, email, password } = result.data;

  try {
    // Check Email Duplicate
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({ message: 'Email Telah Terdaftar' });
      return;
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Create Customer
    const createCustomer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        customerProfile: {
          create: {
            loyaltyPoints: 10,
          },
        },
      },
    });

    // Console Response
    baseLogger.info(
      `Registrasi Berhasil| customer-id: ${createCustomer.email}`
    );

    // Send Response
    res.status(200).json({
      success: true,
      message: 'Registrasi Berhasil',
      data: {
        redirectUrl: '/auth/login',
      },
    });
  } catch (error) {
    baseLogger.error('Error during registration', {
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
    });
  }
};

export const loginAuth = async (req: Request, res: Response): Promise<void> => {
  // Validate request body
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({ success: false, message: result.error.issues[0].message });
    return;
  }
  const { email, password } = result.data;

  // Validate JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    baseLogger.error('JWT Tidak Terdeteksi');
    res
      .status(500)
      .json({ success: false, message: 'Konfigurasi Server Salah' });
    return;
  }

  try {
    // Check Login
    const user = await prisma.user.findUnique({
      where: {
        email,
        isDeleted: false,
      },
      include: {
        customerProfile: true,
        kasirProfile: true,
        adminProfile: true,
      },
    });
    // Check login
    if (!user) {
      res.status(401).json({ message: 'Email Tidak Terdaftar' });
      return;
    }
    // Check Customer if Deleted
    if (user.isDeleted) {
      res.status(403).json({ message: 'Akun Tidak Aktif' });
      return;
    }
    // Check User Role and Profile
    if (user.role === 'CUSTOMER' && !user.customerProfile) {
      res.status(403).json({
        success: false,
        message: 'Profil pelanggan tidak valid',
        errorCode: 'INVALID_PROFILE',
      });
      return;
    }
    if (user.role === 'KASIR' && !user.kasirProfile) {
      res.status(403).json({
        success: false,
        message: 'Profil kasir tidak valid',
        errorCode: 'INVALID_PROFILE',
      });
      return;
    }
    if (user.role === 'ADMIN' && !user.adminProfile) {
      res.status(403).json({
        success: false,
        message: 'Profil admin tidak valid',
        errorCode: 'INVALID_PROFILE',
      });
      return;
    }
    // Check Password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Email Atau Password Salah' });
      return;
    }
    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      } as JwtPayload,
      jwtSecret,
      { expiresIn: '1h' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 1000,
    });
    // Mapping Object Profile
    const profileMap: { [key in UserRole]: () => object } = {
      CUSTOMER: () => ({
        loyaltyPoints: user.customerProfile?.loyaltyPoints,
        phoneNumber: user.customerProfile?.phoneNumber,
        profile: user.customerProfile?.profile,
      }),
      KASIR: () => ({
        shift: user.kasirProfile?.shift,
      }),
      ADMIN: () => ({
        permissions: user.adminProfile?.permissions,
      }),
    };
    const profileData = profileMap[user.role]();
    // Console Response
    baseLogger.info(`Login Berhasil| user-id: ${user.id}`);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login Berhasil',
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        profile: profileData,
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
    });
  }
};
