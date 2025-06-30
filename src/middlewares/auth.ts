import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { baseLogger } from './logger';
import { JwtPayload } from '../types/express';

// Middleware untuk autentikasi umum
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token?.replace('Bearer ', '');

  if (!token) {
    baseLogger.warn('No token provided in request');
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    baseLogger.info(
      `Authenticated user: ${decoded.email} | role: ${decoded.role}`
    );
    next();
  } catch (error) {
    baseLogger.error('Token verification failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
    return;
  }
};

// Middleware untuk memeriksa role spesifik
export const restrictTo = (...allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      baseLogger.warn('No user data in request');
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      baseLogger.warn(
        `Access denied for user: ${req.user.email} | role: ${req.user.role}`
      );
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    next();
  };
};
