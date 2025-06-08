import type { Request, Response } from 'express';
import { PrismaClient, RoleType } from '@prisma/client';
import { hashPassword } from '../utils/hash.ts';

const prisma = new PrismaClient();

export const registerCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  // Check Required Fields
  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
  }
  try {
    // Check Email Duplicate
    const exitingCustomer = await prisma.customer.findUnique({
      where: { email },
    });
    if (exitingCustomer) {
      res.status(400).json({ message: 'Email already exists' });
    }
    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Create Customer
    const createCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: RoleType.customer,
      },
    });

    //  Success Response
    res.status(201).json({
      message: 'Customer created successfully',
      data: {
        id: createCustomer.id,
        name: createCustomer.name,
        email: createCustomer.email,
        role: createCustomer.role,
      },
    });
  } catch (error) {
    console.error('Error registering customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
