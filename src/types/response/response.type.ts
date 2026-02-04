import { UserRole } from '@prisma/client';

export interface RegisterResponse {
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthMeResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

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
