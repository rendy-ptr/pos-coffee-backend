import { UserRole } from '@prisma/client';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: number;
    email: string;
    role: UserRole;
  }
}
