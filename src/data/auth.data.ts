import { UserRole } from '@prisma/client';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  redirectUrl?: string;
}

export interface LoginResponse {
  user: AuthUserResponse;
  token: string;
}
