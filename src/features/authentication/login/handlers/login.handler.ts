import type { Request, Response } from 'express';
import { LoginDTO } from '../schemas/login.schema';
import { ApiRes } from '@/types/api.type';
import { BusinessError } from '@/utils/errors';
import { baseLogger } from '@/middlewares/logger';
import { loginService } from '../services/login.service';
import { LoginResponse } from '../interfaces/login.interface';

export const handleLogin = async (
  req: Request<{}, {}, LoginDTO>,
  res: Response<ApiRes<LoginResponse>>
) => {
  try {
    const body = req.body;
    const result = await loginService.login(body);

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
