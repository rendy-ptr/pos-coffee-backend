import { UserRole } from '@prisma/client';

export interface AuthMeResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
