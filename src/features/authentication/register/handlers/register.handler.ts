import type { Request, Response } from 'express';
import type { ApiRes } from '@/types/api.type';
import { BusinessError } from '@/utils/errors';
import { baseLogger } from '@/middlewares/logger';
import { RegisterDTO } from '@/features/authentication/register/schemas/register.schema';
import { registerService } from '../services/register.service';
import { RegisterResponse } from '../interfaces/register.interface';

export const handleRegister = async (
  req: Request<{}, {}, RegisterDTO>,
  res: Response<ApiRes<RegisterResponse>>
) => {
  try {
    const body = req.body;
    const result = await registerService.register(body);

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
