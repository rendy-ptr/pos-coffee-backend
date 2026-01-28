import type { Request, Response, NextFunction } from 'express';
import type { ObjectSchema } from 'joi';
import type { ApiResponse } from '@/types/ApiResponse';

export const validate = (schema: ObjectSchema) => {
  return (
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);

      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors,
        errorCode: 'VALIDATION_ERROR',
      });
      return;
    }

    req.body = value;
    next();
  };
};
