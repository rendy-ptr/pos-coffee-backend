import { UserRole } from '@prisma/client';

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    redirectUrl: string;
  };
  token: string;
}
