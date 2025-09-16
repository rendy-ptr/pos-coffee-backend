import type { CreateKasirSchema } from '../schemas/kasir.schema';

export const KASIR_MOCK: CreateKasirSchema[] = [
  {
    name: 'Budi Santoso',
    email: 'budi@example.com',
    phone: '081234567890',
    profilePicture: undefined,
    shiftStart: '08:00',
    shiftEnd: '16:00',
    isActive: true,
  },
  {
    name: 'Siti Aisyah',
    email: 'siti@example.com',
    phone: '081987654321',
    profilePicture: undefined,
    shiftStart: '09:00',
    shiftEnd: '17:00',
    isActive: true,
  },
  {
    name: 'Ahmad Fauzi',
    email: 'ahmad@example.com',
    phone: '082345678901',
    profilePicture: undefined,
    shiftStart: '07:00',
    shiftEnd: '15:00',
    isActive: true,
  },
  {
    name: 'Dewi Lestari',
    email: 'dewi@example.com',
    phone: '083456789012',
    profilePicture: undefined,
    shiftStart: '10:00',
    shiftEnd: '18:00',
    isActive: false,
  },
];
