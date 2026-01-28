/**
 * Integration Test Example - Category Routes
 * Tests entire request-response flow
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000';

describe('Category Routes (Integration)', () => {
  let authToken: string;
  let categoryId: string;

  beforeAll(async () => {
    // Login to get auth token
    const loginRes = await request(API_URL).post('/api/auth/login').send({
      email: 'admin@mail.com',
      password: 'password123',
    });

    authToken = loginRes.headers['set-cookie'][0];
  });

  afterAll(async () => {
    // Cleanup: delete test data
    if (categoryId) {
      await prisma.category.delete({
        where: { id: categoryId },
      });
    }
    await prisma.$disconnect();
  });

  describe('POST /api/admin/kategori', () => {
    it('should create category successfully', async () => {
      const res = await request(API_URL)
        .post('/api/admin/kategori')
        .set('Cookie', authToken)
        .send({
          name: 'Test Category',
          description: 'For testing',
          icon: '🧪',
          isActive: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('berhasil dibuat');

      // Save ID for cleanup
      const category = await prisma.category.findUnique({
        where: { name: 'Test Category' },
      });
      categoryId = category!.id;
    });

    it('should return 400 when missing required fields', async () => {
      const res = await request(API_URL)
        .post('/api/admin/kategori')
        .set('Cookie', authToken)
        .send({
          description: 'Missing name and icon',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 when duplicate name', async () => {
      const res = await request(API_URL)
        .post('/api/admin/kategori')
        .set('Cookie', authToken)
        .send({
          name: 'Test Category', // Already exists
          icon: '🧪',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('BUSINESS_ERROR');
      expect(res.body.message).toContain('sudah ada');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(API_URL).post('/api/admin/kategori').send({
        name: 'Test',
        icon: '🧪',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/kategori', () => {
    it('should get all categories', async () => {
      const res = await request(API_URL)
        .get('/api/admin/kategori')
        .set('Cookie', authToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /api/admin/kategori/:id', () => {
    it('should update category successfully', async () => {
      const res = await request(API_URL)
        .patch(`/api/admin/kategori/${categoryId}`)
        .set('Cookie', authToken)
        .send({
          name: 'Updated Test Category',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('berhasil diperbarui');
    });

    it('should return 404 when category not found', async () => {
      const res = await request(API_URL)
        .patch('/api/admin/kategori/non-existent-id')
        .set('Cookie', authToken)
        .send({
          name: 'Updated',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/admin/kategori/:id', () => {
    it('should delete category successfully', async () => {
      const res = await request(API_URL)
        .delete(`/api/admin/kategori/${categoryId}`)
        .set('Cookie', authToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('berhasil dihapus');

      // Mark as deleted so cleanup doesn't fail
      categoryId = '';
    });
  });
});
