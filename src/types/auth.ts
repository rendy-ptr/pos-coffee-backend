import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}
