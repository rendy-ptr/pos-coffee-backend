import type { CreateKasirInput } from '../schemas/kasir.schema';

export const KASIR_MOCK: CreateKasirInput[] = [
  {
    name: 'Budi Santoso',
    email: 'budi@mail.com',
    password: 'password123',
    phone: '081234567890',
    profilePicture: null,
    shiftStart: '08:00',
    shiftEnd: '16:00',
    isActive: true,
  },
  {
    name: 'Siti Aisyah',
    email: 'siti@mail.com',
    password: 'password123',
    phone: '081987654321',
    profilePicture: null,
    shiftStart: '09:00',
    shiftEnd: '17:00',
    isActive: true,
  },
  {
    name: 'Ahmad Fauzi',
    email: 'ahmad@mail.com',
    password: 'password123',
    phone: '082345678901',
    profilePicture: null,
    shiftStart: '07:00',
    shiftEnd: '15:00',
    isActive: true,
  },
  {
    name: 'Dewi Lestari',
    email: 'dewi@mail.com',
    password: 'password123',
    phone: '083456789012',
    profilePicture: null,
    shiftStart: '10:00',
    shiftEnd: '18:00',
    isActive: false,
  },
];
