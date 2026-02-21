import { cashierRepository } from '@/features/admin-role/cashier/repositories/cashier.repository';
import {
  CashierListResponse,
  CashierDetailResponse,
  CashierMutateResponse,
} from '@/features/admin-role/cashier/queries/cashier.query';
import { BusinessError, NotFoundError } from '@/utils/errors';
import { baseLogger } from '@/middlewares/logger';
import crypto from 'crypto';
import { hashPassword } from '@/utils/hash';
import { Prisma, UserRole, User } from '@prisma/client';
import { prisma } from '@/utils/prisma';
import { emailService } from '../../../../services/email.service';
import {
  CreateCashierDTO,
  UpdateCashierDTO,
} from '@/features/admin-role/cashier/schemas/cashier.schema';

export class CashierService {
  private repository = cashierRepository;

  async getAllCashier(): Promise<CashierListResponse[]> {
    return this.repository.getAll();
  }

  async createCashier(data: CreateCashierDTO): Promise<CashierMutateResponse> {
    const existingCashier = await this.repository.findByEmail(data.email);
    if (existingCashier) {
      throw new BusinessError('Kasir dengan email tersebut sudah ada');
    }

    const plainPassword = crypto.randomBytes(6).toString('base64');

    const hashed = await hashPassword(plainPassword);

    const { shiftStart, shiftEnd, ...userData } = data;

    const cashier = await prisma.$transaction(async tx => {
      const created = await this.repository.create(
        {
          ...userData,
          password: hashed,
          role: UserRole.CASHIER,
          cashierProfile: {
            create: {
              shiftStart,
              shiftEnd,
            },
          },
        },
        tx
      );

      await emailService.sendNewAccountNotification(data, plainPassword);

      return created;
    });

    baseLogger.info(`Kasir dibuat: ${cashier.name}`);

    return cashier;
  }

  async updateCashier(
    id: string,
    data: UpdateCashierDTO
  ): Promise<CashierMutateResponse> {
    const existingCashier = await this.repository.findById(id);
    if (!existingCashier) {
      throw new NotFoundError('Kasir tidak ditemukan');
    }

    if (data.email && data.email !== existingCashier.email) {
      const duplicateCashier = await this.repository.findByEmail(data.email);
      if (duplicateCashier) {
        throw new BusinessError('Kasir dengan email tersebut sudah ada');
      }
    }

    const { shiftStart, shiftEnd, ...updateData } = data;
    const finalUpdateData: Prisma.UserUpdateInput = { ...updateData };

    if (shiftStart || shiftEnd) {
      finalUpdateData.cashierProfile = {
        update: {
          shiftStart,
          shiftEnd,
        },
      };
    }

    const updatedCashier = await this.repository.update(id, finalUpdateData);

    baseLogger.info(`Kasir diperbarui: ${updatedCashier.name}`);

    return updatedCashier;
  }

  async deleteCashier(id: string): Promise<User> {
    const existingCashier = await this.repository.findById(id);
    if (!existingCashier) {
      throw new NotFoundError('Kasir tidak ditemukan');
    }

    const deletedCashier = await this.repository.delete(id);

    baseLogger.info(`Kasir dihapus: ${deletedCashier.name}`);
    return deletedCashier;
  }

  async getCashierDetail(id: string): Promise<CashierDetailResponse> {
    const cashier = await this.repository.findCashierDetail(id);
    if (!cashier) {
      throw new NotFoundError('Kasir tidak ditemukan');
    }
    return cashier;
  }
}

export const cashierService = new CashierService();
