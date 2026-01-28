/**
 * Unit Test Example - Category Service
 * Tests business logic in isolation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoryService } from '@/services/category.service';
import { categoryRepository } from '@/repositories/category.repository';
import { BusinessError, NotFoundError } from '@/utils/errors';

// Mock repository
vi.mock('@/repositories/category.repository');

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    service = new CategoryService();
    vi.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create category successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const data = {
        name: 'Coffee',
        description: 'Hot and cold coffee',
        icon: '☕',
        isActive: true,
      };

      vi.mocked(categoryRepository.findByName).mockResolvedValue(null);
      vi.mocked(categoryRepository.create).mockResolvedValue({
        id: 'cat-123',
        ...data,
        description: data.description,
        createdById: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await service.createCategory(userId, data);

      // Assert
      expect(result.name).toBe('Coffee');
      expect(categoryRepository.findByName).toHaveBeenCalledWith('Coffee');
      expect(categoryRepository.create).toHaveBeenCalled();
    });

    it('should throw BusinessError when category name already exists', async () => {
      // Arrange
      const userId = 'user-123';
      const data = {
        name: 'Coffee',
        icon: '☕',
        isActive: true,
      };

      vi.mocked(categoryRepository.findByName).mockResolvedValue({
        id: 'existing-cat',
        name: 'Coffee',
        description: null,
        icon: '☕',
        isActive: true,
        createdById: 'other-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act & Assert
      await expect(service.createCategory(userId, data)).rejects.toThrow(
        BusinessError
      );
      await expect(service.createCategory(userId, data)).rejects.toThrow(
        'Kategori dengan nama tersebut sudah ada'
      );
    });
  });

  describe('updateCategory', () => {
    it('should throw NotFoundError when category does not exist', async () => {
      // Arrange
      const id = 'non-existent-id';
      const data = { name: 'Updated Name' };

      vi.mocked(categoryRepository.findById).mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateCategory(id, data)).rejects.toThrow(
        NotFoundError
      );
      await expect(service.updateCategory(id, data)).rejects.toThrow(
        'Kategori tidak ditemukan'
      );
    });

    it('should update category successfully', async () => {
      // Arrange
      const id = 'cat-123';
      const data = { name: 'Updated Coffee' };

      vi.mocked(categoryRepository.findById).mockResolvedValue({
        id,
        name: 'Coffee',
        description: null,
        icon: '☕',
        isActive: true,
        createdById: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(categoryRepository.findByName).mockResolvedValue(null);

      vi.mocked(categoryRepository.update).mockResolvedValue({
        id,
        name: 'Updated Coffee',
        description: null,
        icon: '☕',
        isActive: true,
        createdById: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await service.updateCategory(id, data);

      // Assert
      expect(result.name).toBe('Updated Coffee');
      expect(categoryRepository.update).toHaveBeenCalledWith(id, data);
    });
  });

  describe('deleteCategory', () => {
    it('should throw BusinessError when category has menus', async () => {
      // Arrange
      const id = 'cat-123';

      vi.mocked(categoryRepository.findById).mockResolvedValue({
        id,
        name: 'Coffee',
        description: null,
        icon: '☕',
        isActive: true,
        createdById: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(categoryRepository.countMenusByCategory).mockResolvedValue(5);

      // Act & Assert
      await expect(service.deleteCategory(id)).rejects.toThrow(BusinessError);
      await expect(service.deleteCategory(id)).rejects.toThrow(
        'Kategori masih digunakan oleh menu'
      );
    });
  });
});
