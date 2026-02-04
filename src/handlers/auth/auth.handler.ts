import type { Request, Response } from 'express';
import { authService } from '@/services/auth.service';
import type { ApiRes } from '@/types/response/api.type';
import { BusinessError } from '@/utils/errors';
import { baseLogger } from '@/middlewares/logger';
import type {
  AuthMeResponse,
  RegisterResponse,
  LoginResponse,
} from '@/types/response/response.type';
import { LoginDTO, RegisterDTO } from '@/schemas/register.schema';

export const handleRegister = async (
  req: Request<{}, {}, RegisterDTO>,
  res: Response<ApiRes<RegisterResponse>>
) => {
  try {
    const body = req.body;
    const result = await authService.register(body);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: result,
    });
  } catch (error) {
    if (error instanceof BusinessError) {
      res.status(400).json({
        success: false,
        message: error.message,
        errorCode: 'BUSINESS_ERROR',
        data: null,
      });
      return;
    }

    baseLogger.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleLogin = async (
  req: Request<{}, {}, LoginDTO>,
  res: Response<ApiRes<LoginResponse>>
) => {
  try {
    const body = req.body;
    const result = await authService.login(body);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: result,
    });
  } catch (error) {
    if (error instanceof BusinessError) {
      res.status(401).json({
        success: false,
        message: error.message,
        errorCode: 'INVALID_CREDENTIALS',
        data: null,
      });
      return;
    }

    baseLogger.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleLogout = async (
  req: Request,
  res: Response<ApiRes<null>>
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
  req: Request,
  res: Response<ApiRes<AuthMeResponse>>
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Sesi berakhir, silakan login kembali',
      data: null,
    });
    return;
  }

  const responseData: AuthMeResponse = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };

  res.status(200).json({
    success: true,
    message: 'Data pengguna berhasil diambil',
    data: responseData,
  });
};
