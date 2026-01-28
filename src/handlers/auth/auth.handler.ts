import type { Request, Response } from 'express';
import { authService } from '@/services/auth.service';
import type { AuthRequest } from '@/types/auth';
import type { ApiResponse } from '@/types/ApiResponse';
import { BusinessError } from '@/utils/errors';
import { baseLogger } from '@/middlewares/logger';
import type { RegisterDTO, LoginDTO, AuthUserResponse } from '@/data/auth.data';

export const handleRegister = async (
  req: Request<RegisterDTO>,
  res: Response<ApiResponse<AuthUserResponse>>
) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'Registrasi Berhasil',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        redirectUrl: '/auth/login',
      },
    });
  } catch (error) {
    if (error instanceof BusinessError) {
      res.status(400).json({
        success: false,
        message: error.message,
        errorCode: 'BUSINESS_ERROR',
      });
      return;
    }

    baseLogger.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      errorCode: 'SERVER_ERROR',
    });
  }
};

export const handleLogin = async (
  req: Request<LoginDTO>,
  res: Response<ApiResponse<AuthUserResponse>>
) => {
  try {
    const { user, token } = await authService.login(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login Berhasil',
      data: {
        ...user,
        redirectUrl: `/dashboard/${user.role.toLowerCase()}`,
      },
    });
  } catch (error) {
    if (error instanceof BusinessError) {
      res.status(401).json({
        success: false,
        message: error.message,
        errorCode: 'INVALID_CREDENTIALS',
      });
      return;
    }

    baseLogger.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      errorCode: 'SERVER_ERROR',
    });
  }
};

export const handleLogout = async (
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

export const handleAuthMe = async (
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
