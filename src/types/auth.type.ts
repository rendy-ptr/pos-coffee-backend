import { UserRole } from '@prisma/client';

export interface UserContext {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserContext;
  }
}
