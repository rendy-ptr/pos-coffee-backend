import { kasirRepository } from '@/repositories/admin/kasir.repository';
import {
  KasirListResponse,
  KasirDetailResponse,
  kasirMutateResponse,
} from '@/queries/kasir.query';
import { BusinessError, NotFoundError } from '@/utils/errors';
import { baseLogger } from '@/middlewares/logger';
import crypto from 'crypto';
import { hashPassword } from '@/utils/hash';
import { Prisma, UserRole, User } from '@prisma/client';
import { emailService } from '../shared/email.service';
import { CreateKasirDTO, UpdateKasirDTO } from '@/schemas/kasir.schema';

export class KasirService {
  private repository = kasirRepository;

  async getAllKasir(): Promise<KasirListResponse[]> {
    return this.repository.getAll();
  }

  async createKasir(data: CreateKasirDTO): Promise<kasirMutateResponse> {
    const existingKasir = await this.repository.findByEmail(data.email);
    if (existingKasir) {
      throw new BusinessError('Kasir dengan email tersebut sudah ada');
    }

    const plainPassword = crypto.randomBytes(6).toString('base64');

    const hashed = await hashPassword(plainPassword);

    const { shiftStart, shiftEnd, ...userData } = data;

    const kasir = await this.repository.create({
      ...userData,
      password: hashed,
      role: UserRole.KASIR,
      kasirProfile: {
        create: {
          shiftStart,
          shiftEnd,
        },
      },
    });

    await emailService.sendNewAccountNotification(data, plainPassword);

    baseLogger.info(`Kasir dibuat: ${kasir.name}`);

    return kasir;
  }

  async updateKasir(
    id: string,
    data: UpdateKasirDTO
  ): Promise<kasirMutateResponse> {
    const existingKasir = await this.repository.findById(id);
    if (!existingKasir) {
      throw new NotFoundError('Kasir tidak ditemukan');
    }

    if (data.email && data.email !== existingKasir.email) {
      const duplicateKasir = await this.repository.findByEmail(data.email);
      if (duplicateKasir) {
        throw new BusinessError('Kasir dengan email tersebut sudah ada');
      }
    }

    const { shiftStart, shiftEnd, ...updateData } = data;
    const finalUpdateData: Prisma.UserUpdateInput = { ...updateData };

    if (shiftStart || shiftEnd) {
      finalUpdateData.kasirProfile = {
        update: {
          shiftStart,
          shiftEnd,
        },
      };
    }

    const updatedKasir = await this.repository.update(id, finalUpdateData);

    baseLogger.info(`Kasir diperbarui: ${updatedKasir.name}`);

    return updatedKasir;
  }

  async deleteKasir(id: string): Promise<User> {
    const existingKasir = await this.repository.findById(id);
    if (!existingKasir) {
      throw new NotFoundError('Kasir tidak ditemukan');
    }

    const deletedKasir = await this.repository.delete(id);

    baseLogger.info(`Kasir dihapus: ${deletedKasir.name}`);
    return deletedKasir;
  }

  async getKasirDetail(id: string): Promise<KasirDetailResponse> {
    const kasir = await this.repository.findKasirDetail(id);
    if (!kasir) {
      throw new NotFoundError('Kasir tidak ditemukan');
    }
    return kasir;
  }
}

export const kasirService = new KasirService();
