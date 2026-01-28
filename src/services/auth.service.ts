import { userRepository } from '@/repositories/user.repository';
import { hashPassword, comparePassword } from '@/utils/hash';
import jwt from 'jsonwebtoken';
import { BusinessError } from '@/utils/errors';
import type { JwtPayload } from '@/types/auth';

import { RegisterDTO, LoginDTO, LoginResponse } from '@/data/auth.data';
import type { User } from '@prisma/client';

export class AuthService {
  private repository = userRepository;

  async register(data: RegisterDTO): Promise<User> {
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new BusinessError('Email Telah Terdaftar');
    }

    const hashedPassword = await hashPassword(data.password);

    return this.repository.createWithCustomer({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
  }

  async login(data: LoginDTO): Promise<LoginResponse> {
    const user = await this.repository.findByEmail(data.email);

    if (!user || user.isActive === false) {
      throw new BusinessError('Email Tidak Terdaftar');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new BusinessError('Email Atau Password Salah');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      } as JwtPayload,
      jwtSecret,
      { expiresIn: '1h', algorithm: 'HS256' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }
}

export const authService = new AuthService();
