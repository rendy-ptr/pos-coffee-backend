import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@/types/auth.type';
import { LoginDTO } from '../schemas/login.schema';
import { BusinessError } from '@/utils/errors';
import { comparePassword } from '@/utils/hash';
import { loginRepository } from '../repositories/login.repository';
import { LoginResponse } from '../interfaces/login.interface';

export class LoginService {
  private repository = loginRepository;

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
        name: user.name,
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
        email: user.email,
        role: user.role,
        redirectUrl: `/dashboard/${user.role.toLowerCase()}`,
      },
      token,
    };
  }
}

export const loginService = new LoginService();
