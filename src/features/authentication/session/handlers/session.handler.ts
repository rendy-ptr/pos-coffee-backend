import type { Request, Response } from 'express';
import type { ApiRes } from '@/types/api.type';
import { AuthMeResponse } from '../interfaces/session.interface';

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
