import { registerRepository } from '@/features/authentication/register/repositories/register.repository';
import { hashPassword } from '@/utils/hash';
import { BusinessError } from '@/utils/errors';
import { RegisterDTO } from '@/features/authentication/register/schemas/register.schema';
import { RegisterResponse } from '../interfaces/register.interface';

export class RegisterService {
  private repository = registerRepository;

  async register(data: RegisterDTO): Promise<RegisterResponse> {
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new BusinessError('Email Telah Terdaftar');
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await this.repository.createWithCustomer({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }
}

export const registerService = new RegisterService();
