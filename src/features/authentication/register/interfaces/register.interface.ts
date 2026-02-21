import { UserRole } from '@prisma/client';

export interface RegisterResponse {
  name: string;
  email: string;
  role: UserRole;
}
