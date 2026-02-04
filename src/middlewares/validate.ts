import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodType } from 'zod';
import type { ApiRes } from '@/types/response/api.type';

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response<ApiRes<null>>, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => issue.message);

        res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errorCode: 'VALIDATION_ERROR',
          errors,
          data: null,
        });
        return;
      }

      next(error);
    }
  };
