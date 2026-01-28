/**
 * Test Setup File
 * Runs before all tests
 */

import { beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup: connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup: disconnect from database
  await prisma.$disconnect();
});
