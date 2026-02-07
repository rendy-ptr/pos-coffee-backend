import { tableRepository } from '@/repositories/admin/table.repository';
import { NotFoundError, BusinessError } from '@/utils/errors';
import type { Table } from '@prisma/client';
import { baseLogger } from '@/middlewares/logger';
import { CreateTableDTO, UpdateTableDTO } from '@/schemas/table.schema';

export class TableService {
  private repository = tableRepository;

  async getAllTable(): Promise<Table[]> {
    return this.repository.getAll();
  }

  async createTable(data: CreateTableDTO): Promise<Table> {
    const existingTable = await this.repository.findByNumber(data.number);
    if (existingTable) {
      throw new BusinessError('Meja dengan nomor tersebut sudah ada');
    }

    const table = await this.repository.create({
      number: data.number,
      location: data.location,
      capacity: data.capacity,
      status: data.status,
    });

    baseLogger.info(`Meja dibuat: ${table.number}`);
    return table;
  }

  async updateTable(id: string, data: UpdateTableDTO): Promise<Table> {
    const existingTable = await this.repository.findById(id);
    if (!existingTable) {
      throw new NotFoundError('Meja tidak ditemukan');
    }

    if (data.number && data.number !== existingTable.number) {
      const duplicateTable = await this.repository.findByNumber(data.number);
      if (duplicateTable) {
        throw new BusinessError('Meja dengan nomor tersebut sudah ada');
      }
    }

    const updatedTable = await this.repository.update(id, data);

    baseLogger.info(`Meja diperbarui: ${updatedTable.number}`);
    return updatedTable;
  }

  async deleteTable(id: string): Promise<Table> {
    const table = await this.repository.findById(id);
    if (!table) {
      throw new NotFoundError('Meja tidak ditemukan');
    }

    await this.repository.delete(id);

    baseLogger.info(`Meja dihapus: ${table.number}`);
    return table;
  }
}

export const tableService = new TableService();

